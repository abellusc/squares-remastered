import { IPickup } from "./IPickup";
import { IRenderable } from "./IRenderable";
import { IApplicationState } from "./IApplicationState";

const context = (document.getElementById('canvas') as HTMLCanvasElement).getContext('2d');

export class ScorePickup implements IPickup, IRenderable {
    position: [ number, number ] = [0, 0];
    velocity: [ number, number ] = [0, 0];
    points: number = 10;
    radius: number = 10;

    constructor(score: number, position?: [number, number], velocity?: [number, number]) {
        const n = Math.floor(Math.random() * 4);
        console.log('Creating a score pickup', n);
        if (n % 4 === 0) {
            this.position = position || [ Math.floor(Math.random() * context.canvas.width), 0];
            this.velocity = velocity || [0, this.getScoreVelocity(score)];
        } else if (n % 4 === 1) {
            this.position = position || [ 0, Math.floor(Math.random() * context.canvas.height)];
            this.velocity = velocity || [this.getScoreVelocity(score), 0];
        } else if (n % 4 === 2) {
            this.position = position || [ context.canvas.width, Math.floor(Math.random() * context.canvas.height) ];
            this.velocity = velocity || [-1 * this.getScoreVelocity(score), 0];
        } else if (n % 4 === 3) {
            this.position = position || [ Math.floor(Math.random() * context.canvas.width), context.canvas.height ];
            this.velocity = velocity || [0, -1 * this.getScoreVelocity(score)];
        }

        this.radius = Math.floor(Math.random() * 20) + 10;
    }

    getScoreVelocity(score: number): number {
        const n = Math.floor(score / 1000) + 1;

        if (n < 4) {
            return n;
        }

        return 4;
    }

    update(state: IApplicationState): IApplicationState {
        // new position
        this.position = [ this.position[0] + this.velocity[0], this.position[1] + this.velocity[1] ];

        context!.fillStyle = '#ffffff';
        context!.fillRect(this.position[0], this.position[1], this.radius, this.radius);
        context!.fillStyle = '#000000';
        return state;
    }
    onPickup(cb: () => any): void {
        cb();
    }

    setPosition(x: number, y: number): void {
        this.position = [ x, y ];
    }

    getPosition(): [ number, number ] {
        return this.position;
    }

    getRadius(): number {
        return this.radius;
    }
}