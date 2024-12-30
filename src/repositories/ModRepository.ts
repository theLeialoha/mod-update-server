import { ModAndUpdateCount, ModEntity } from "../types/entities";
import { Optional } from "../types/java";
import { ManagedRepository } from "./Repository";

class ModRepositoryImp extends ManagedRepository<any> {

//     @Query("SELECT new de.maxhenkel.modupdateserver.entities.ModAndUpdateCount(m, COUNT(u.id)) FROM update u, mod m WHERE m.modID = :modId AND m.modID = u.mod GROUP BY u.mod, m.modID")
    getModWithUpdateCount(modId: string): Optional<ModAndUpdateCount> {
        return null;
    }

}

export const ModRepository = new ModRepositoryImp("mod");
