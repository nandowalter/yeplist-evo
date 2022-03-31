export class ImmutableDate {
    private _value: Date;
    
    constructor(date?: string | Date) {
        this._value = new Date(date);
        Object.freeze(this);
    }

    toJson() {
        return this._value?.toISOString();
    }

    get date() {
        return this._value.getTime();
    }
}