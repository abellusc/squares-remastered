import { IRenderable } from "./IRenderable";
import { IApplicationState } from "./IApplicationState";

const context = (document.getElementById('canvas') as HTMLCanvasElement).getContext('2d');

export class Player implements IRenderable {
    position: [number, number] = [0, 0];
    private multiplier = 1;

    update(state: IApplicationState): IApplicationState {
        context!.save();
        context!.fillStyle = '#999999';
    
        context!.fillRect(this.position[0], this.position[1], this.multiplier * 2 + 10, this.multiplier * 2 + 10);
        context!.fillStyle = '#000000';
        context!.restore();
        return state;
    }

    setPosition(x: number, y: number): void {
        this.position = [ x, y ];
    }

    getPosition(): [ number, number ] {
        return this.position;
    }

    getMultiplier(): number {
        return this.multiplier;
    }

    setMultiplier(multiplier: number): void {
        this.multiplier = multiplier;
    }
}