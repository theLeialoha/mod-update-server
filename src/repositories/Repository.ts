import { List, Optional } from "../types/java";

export class Repository<K, V> {
    public counter: number = 0;

    save(arg0: K): any {
        throw new Error("Method not implemented.");
    }
    deleteById(id: string) {
        throw new Error("Method not implemented.");
    }
    existsById(id: string): boolean {
        throw new Error("Method not implemented.");
    }
    findById(id: string): Optional<K> {
        throw new Error("Method not implemented.");
    }
    findAll(): List<K> {
        throw new Error("Method not implemented.");
    }
    count(): number {
        throw new Error("Method not implemented.");
    }

}


export class Pageable {

    readonly page: number;
    readonly amount: number;

    private constructor(page: number, amount: number) {
        this.page = page;
        this.amount = amount;
    }

    static of(page: number, amount: number): Pageable {
        return new Pageable(page, amount);
    }
}