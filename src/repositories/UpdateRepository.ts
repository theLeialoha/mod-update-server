import { ModAndUpdate, ModEntity, UpdateEntity, createInstance, createNullableInstance } from "../types/entities";
import { List, long, Optional } from "../types/java";
import { ModRepository } from "./ModRepository";
import { ManagedRepository, Pageable } from "./Repository";

class UpdateRepositoryImp extends ManagedRepository<any> {

    private modWithUpdates: UpdateHandler<ModAndUpdate> = { lastUpdate: 0, value: [] };
    private latestOrRecommendedUpdates: UpdateHandler<UpdateEntity> = { lastUpdate: 0, value: [] };

    public findAllByModOrderByPublishDateDesc(modId: string, pageable: Pageable): List<UpdateEntity> {
        if (!ModRepository.existsByModId(modId)) return [];
        return this.findAll().filter(update => update.mod == modId)
            .map(update => createNullableInstance(UpdateEntity, update))
            .filter(update => update != null).map(update => update as UpdateEntity)
            .sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime())
            .slice(pageable.page * pageable.amount, (pageable.page + 1) * pageable.amount);
    }

    public findFirstByModAndId(modId: string, id: long): Optional<UpdateEntity> {
        if (!ModRepository.existsByModId(modId)) return null;
        const update = this.findAll().find(update => update.mod == modId && update.id == id);
        return createNullableInstance(UpdateEntity, update);
    }

    private getEveryUpdatesWithMod(): List<ModAndUpdate> {
        if ((Date.now() - this.modWithUpdates.lastUpdate) / 1000 > 30) {
            const mods = ModRepository.findAll().map(mod => createNullableInstance(ModEntity, mod));
            this.modWithUpdates.value = this.findAll().map(update => createNullableInstance(UpdateEntity, update))
                .map(update => {
                    const mod = mods.find(mod => mod?.modID == update?.mod);
                    if (mod == null || update == null) return null;
                    return createInstance(ModAndUpdate, { update, mod })
                }).filter(update => update != null).map(update => update as ModAndUpdate)
                .sort((a, b) => b.update.publishDate.getTime() - a.update.publishDate.getTime());
            this.modWithUpdates.lastUpdate = Date.now();
        }
        return this.modWithUpdates.value;
    }

    public getAllUpdatesWithMod(pageable: Pageable): List<ModAndUpdate> {
        return this.getEveryUpdatesWithMod().slice(pageable.page * pageable.amount, (pageable.page + 1) * pageable.amount);
    }

    public getAllByMod(mod: string): List<UpdateEntity> {
        if (!ModRepository.existsByModId(mod)) return [];
        return this.findAll().filter(update => update.mod == mod)
            .map(update => createNullableInstance(UpdateEntity, update))
            .filter(update => update != null).map(update => update as UpdateEntity)
            .sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime());
    }

    public removeAllByMod(modId: string) {
        this.findAll().filter(update => update.mod == modId)
            .map(update => update._id).forEach(id => delete this.cache[id]);
        this.collection.deleteMany({ mod: modId });
    }

    private getLatestOrRecommendedUpdates(): List<UpdateEntity> {
        if ((Date.now() - this.latestOrRecommendedUpdates.lastUpdate) / 1000 > 30) {
            this.latestOrRecommendedUpdates.lastUpdate = Date.now();
            this.latestOrRecommendedUpdates.value = this.findAll().map(update => createNullableInstance(UpdateEntity, update))
                .filter(update => update != null).map(update => update as UpdateEntity)
                .sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime())
                .filter((v, i, a) => {
                    if (v.tags.includes('recommended')) return v;
                    return a.filter(c => c.modLoader == v.modLoader).filter(c => c.mod == v.mod)
                        .findIndex(c => c.gameVersion == v.gameVersion) == i;
                });
        }
        return this.latestOrRecommendedUpdates.value;
    }

    private getLatestUpdates(): List<UpdateEntity> {
        return this.getLatestOrRecommendedUpdates()
            .filter((v, i, a) => { // Grabs the latest releases
                return a.filter(c => c.modLoader == v.modLoader).filter(c => c.mod == v.mod)
                    .findIndex(c => c.gameVersion == v.gameVersion) == i;
            });

    }

    private getRecommendedUpdates(): List<UpdateEntity> {
        return this.getLatestOrRecommendedUpdates().reverse()
            .filter((v, i, a) => { // Gets all recommened mods before the latest
                if (v.tags.includes('recommended')) return v;
                return a.filter(c => c.modLoader == v.modLoader).filter(c => c.mod == v.mod)
                    .findIndex(c => c.gameVersion == v.gameVersion) == i;
            }).reverse().filter((v, i, a) => { // Grabs the latest recommended mods (if multiple were suggested)
                return a.filter(c => c.modLoader == v.modLoader).filter(c => c.mod == v.mod)
                    .findIndex(c => c.gameVersion == v.gameVersion) == i;
            });
    }

    public getLatestUpdateEntries(modId: string, loader: string): List<UpdateEntity> {
        return this.getLatestUpdates().filter(update => update.modLoader == loader)
            .filter(update => update.mod == modId);
    }

    public getRecommendedUpdateEntries(modId: string, loader: string): List<UpdateEntity> {
        return this.getRecommendedUpdates().filter(update => update.modLoader == loader)
            .filter(update => update.mod == modId);
    }
}

export const UpdateRepository = new UpdateRepositoryImp("update");

type UpdateHandler<T> = { lastUpdate: number, value: List<T> };
