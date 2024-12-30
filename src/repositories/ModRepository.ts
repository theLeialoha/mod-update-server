import { ModAndUpdateCount, ModEntity, createNullableInstance } from "../types/entities";
import { Optional } from "../types/java";
import { ManagedRepository } from "./Repository";
import { UpdateRepository } from "./UpdateRepository";

class ModRepositoryImp extends ManagedRepository<any> {

    findByModId(modID: string): Optional<ModEntity> {
        const mod = this.findAll().find(v => v.modID == modID);
        return createNullableInstance(ModEntity, mod);
    }

    deleteByModId(modID: string) {
        const mod = this.findAll().find(v => v.modID == modID);
        if (mod != null) this.deleteById(mod._id);
    }

    getModWithUpdateCount(modID: string): Optional<ModAndUpdateCount> {
        const mod = this.findByModId(modID);
        if (mod == null) return null;
        const updateCount = UpdateRepository.getAllByMod(modID).length;
        return createNullableInstance(ModAndUpdateCount, { mod, updateCount });
    }

    public existsByModId(modID: string): boolean {
        return this.findAll().find(v => v.modID == modID) != null;
    }

}

export const ModRepository = new ModRepositoryImp("mod");
