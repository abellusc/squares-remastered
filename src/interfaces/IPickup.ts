export interface IPickup {
    onPickup(cb: () => any): void;
    getRadius(): number;
}