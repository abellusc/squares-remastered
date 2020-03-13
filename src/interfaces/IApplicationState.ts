import { Player } from "./Player";
import { IPickup } from "./IPickup";
import { IRenderable } from "./IRenderable";

export interface IApplicationState {
    started: boolean;
    score: number;
    multiplier: number;
    player: Player;
    pickups: (IPickup & IRenderable)[];
    invincible: number;
}