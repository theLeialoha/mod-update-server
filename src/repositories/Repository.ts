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
