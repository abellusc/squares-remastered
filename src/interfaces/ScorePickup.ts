import { IPickup } from "./IPickup";
import { IRenderable } from "./IRenderable";
import { IApplicationState } from "./IApplicationState";

const context = (document.getElementById('canvas') as HTMLCanvasElement).getContext('2d');

export class ScorePickup implements IPickup, IRenderable {
    position: [ number, number ] = [0, 0];
    velocity: [ number, number ] = [0, 0];
    points: number = 10;

    constructor(score: number) {
        const n = Math.floor(Math.random() * 4);
        console.log('Creating a score pickup', n);
        if (n % 4 === 0) {
            this.position = [ Math.floor(Math.random() * 640), 0];
            this.velocity = [0, this.getScoreVelocity(score)];
        } else if (n % 4 === 1) {
            this.position = [ 0, Math.floor(Math.random() * 480)];
            this.velocity = [this.getScoreVelocity(score), 0];
        } else if (n % 4 === 2) {
            this.position = [ 640, Math.floor(Math.random() * 480) ];
            this.velocity = [-1 * this.getScoreVelocity(score), 0];
        } else if (n % 4 === 3) {
            this.position = [ Math.floor(Math.random() * 640), 480 ];
            this.velocity = [0, -1 * this.getScoreVelocity(score)];
        }
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

        context!.fillStyle = '#000000';
        context!.fillRect(this.position[0], this.position[1], 10, 10);
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
}