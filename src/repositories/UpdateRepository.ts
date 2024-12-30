import { ModAndUpdate, ModEntity, UpdateEntity } from "../types/entities";
import { List, long, Optional } from "../types/java";
import { ManagedRepository, Pageable } from "./Repository";

class UpdateRepositoryImp extends ManagedRepository<any> {

    findAllByModOrderByPublishDateDesc(modId: string, pageable: Pageable): List<UpdateEntity> {
        return [];
    }

    findFirstByModAndId(modId: string, id: long): Optional<UpdateEntity> {
        return null;
    }

    // @Query("SELECT new de.maxhenkel.modupdateserver.entities.ModAndUpdate(m, u) FROM update u, mod m WHERE u.mod = m.modID ORDER BY u.publishDate DESC")
    getAllUpdatesWithMod(pageable: Pageable): List<ModAndUpdate> {
        return [];
    }

    getAllByMod(mod: string): List<UpdateEntity> {
        return [];
    }

    removeAllByMod(modId: string) {

    }

    // @Query(value = "WITH latest_updates AS (SELECT u.*, ROW_NUMBER() OVER (PARTITION BY u.game_version ORDER BY u.publish_date DESC) AS row_num FROM update u WHERE u.mod = :modId AND u.mod_loader = :loader) SELECT * FROM latest_updates WHERE row_num = 1 ORDER BY publish_date DESC;", nativeQuery = true)
    getLatestUpdateEntries(modId: string, loader: string): List<UpdateEntity> {
        return [];
    }

    // @Query(value = "WITH latest_updates AS (SELECT u.*, ROW_NUMBER() OVER (PARTITION BY u.game_version ORDER BY u.publish_date DESC) AS row_num FROM update u WHERE u.mod = :modId AND u.mod_loader = :loader AND 'recommended' = ANY(u.tags)) SELECT * FROM latest_updates WHERE row_num = 1 ORDER BY publish_date DESC;", nativeQuery = true)
    getRecommendedUpdateEntries(modId: string, loader: string): List<UpdateEntity> {
        return [];
    }
}

export const UpdateRepository = new UpdateRepositoryImp("update");
