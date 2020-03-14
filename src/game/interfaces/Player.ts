import { IRenderable } from "./IRenderable";
import { IApplicationState } from "./IApplicationState";

const context = (document.getElementById('canvas') as HTMLCanvasElement).getContext('2d');

function getRandomColor() {
    switch (Math.floor(Math.random() * 5)) {
        case 0:
            return '#ff00ff';
        case 1:
            return '#0000ff';
        case 2:
            return '#ffff00';
        case 3:
            return '#00ffff';
        case 4:
            return '#00ff00';
    }
}

export class Player implements IRenderable {
    position: [number, number] = [0, 0];
    private multiplier = 1;
    public color: string = '#aaaaaa';
    public mini: boolean = false;

    update(state: IApplicationState): IApplicationState {
        const ctx = (document.getElementById('canvas') as HTMLCanvasElement).getContext('2d');
        ctx.save();
        ctx!.fillStyle = this.color;
        ctx!.fillRect(this.position[0], this.position[1], this.mini ? 10 : this.multiplier * 2 + 10, this.mini ? 10 : this.multiplier * 2 + 10);
        ctx!.fillStyle = '#000000';
        ctx.restore();
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