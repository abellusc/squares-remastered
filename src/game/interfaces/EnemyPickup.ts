import { IPickup } from "./IPickup";
import { IRenderable } from "./IRenderable";
import { IApplicationState } from "./IApplicationState";

const context = (document.getElementById('canvas') as HTMLCanvasElement).getContext('2d');

export class EnemyPickup implements IPickup, IRenderable {
    position: [number, number] = [0, 0];
    velocity: [ number, number ] = [0, 0];
    radius: number = 10;

    constructor(score: number) {
        const n = Math.floor(Math.random() * 4);
        if (n % 4 === 0) {
            this.position = [ Math.floor(Math.random() * context.canvas.width), 0];
            this.velocity = [0, this.getScoreVelocity(score)];
        } else if (n % 4 === 1) {
            this.position = [ 0, Math.floor(Math.random() * context.canvas.height)];
            this.velocity = [this.getScoreVelocity(score), 0];
        } else if (n % 4 === 2) {
            this.position = [ context.canvas.width, Math.floor(Math.random() * context.canvas.height) ];
            this.velocity = [-1 * this.getScoreVelocity(score), 0];
        } else if (n % 4 === 3) {
            this.position = [ Math.floor(Math.random() * context.canvas.width), context.canvas.height ];
            this.velocity = [0, -1 * this.getScoreVelocity(score)];
        }

        this.radius = Math.floor(Math.random() * 10) + 10;
    }

    getScoreVelocity(score: number): number {
        const n = Math.floor(score / 1000) + 1;

        if (n < 5) {
            return n;
        }

        return 5;
    }

    update(state: IApplicationState): IApplicationState {
        // new position
        this.position = [ this.position[0] + this.velocity[0], this.position[1] + this.velocity[1] ];

        context!.fillStyle = '#ff0000';
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