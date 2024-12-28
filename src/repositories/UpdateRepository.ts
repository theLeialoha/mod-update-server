import { ModEntity, UpdateEntity } from "../types/entities";
import { List, long, Optional } from "../types/java";
import { Repository } from "./Repository";

class UpdateRepositoryImp extends Repository<UpdateEntity, string> {
    delete(arg0: any) {
        throw new Error("Method not implemented.");
    }

    findAllByModOrderByPublishDateDesc(modId: string, pageable: Pageable): Page<UpdateEntity> {

    }

    findFirstByModAndId(modId: string, id: long): Optional<UpdateEntity> {

    }

    // @Query("SELECT new de.maxhenkel.modupdateserver.entities.ModAndUpdate(m, u) FROM update u, mod m WHERE u.mod = m.modID ORDER BY u.publishDate DESC")
    getAllUpdatesWithMod(pageable: Pageable): Page<ModAndUpdate> {

    }

    getAllByMod(mod: string): List<UpdateEntity> {

    }

    removeAllByMod(modId: string) {

    }

    // @Query(value = "WITH latest_updates AS (SELECT u.*, ROW_NUMBER() OVER (PARTITION BY u.game_version ORDER BY u.publish_date DESC) AS row_num FROM update u WHERE u.mod = :modId AND u.mod_loader = :loader) SELECT * FROM latest_updates WHERE row_num = 1 ORDER BY publish_date DESC;", nativeQuery = true)
    getLatestUpdateEntries(modId: string, loader: string): List<UpdateEntity> {

    }

    // @Query(value = "WITH latest_updates AS (SELECT u.*, ROW_NUMBER() OVER (PARTITION BY u.game_version ORDER BY u.publish_date DESC) AS row_num FROM update u WHERE u.mod = :modId AND u.mod_loader = :loader AND 'recommended' = ANY(u.tags)) SELECT * FROM latest_updates WHERE row_num = 1 ORDER BY publish_date DESC;", nativeQuery = true)
    getRecommendedUpdateEntries(modId: string, loader: string): List<UpdateEntity> {

    }
}

export const UpdateRepository = new UpdateRepositoryImp();
