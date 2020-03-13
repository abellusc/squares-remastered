import { IApplicationState } from "./interfaces/IApplicationState";
import { Player } from "./interfaces/Player";
import { EnemyPickup } from "./interfaces/EnemyPickup";
import { ScorePickup } from "./interfaces/ScorePickup";

const FPS = 60;
const context = (document.getElementById('canvas') as HTMLCanvasElement).getContext('2d');
const visualizerContext = (document.getElementById('visualizer') as HTMLCanvasElement).getContext('2d');
const MAX_PICKUPS = 20;

const myMusic = document.getElementById("music") as HTMLAudioElement;
const gameOverSound = document.getElementById("gameoversound") as HTMLAudioElement;
const pickupSound = document.getElementById("pickupsound") as HTMLAudioElement;
pickupSound.playbackRate = 3.0;

let state: IApplicationState = {
    started: false,
    player: new Player(),
    pickups: [],
    score: 0,
    multiplier: 1,
};

function onMouseMove(ev: MouseEvent) {
    if (ev.clientX >= 0 && ev.clientY >= 0 && ev.clientX <= context.canvas.width - (state.player.getMultiplier() * 2 + 10) && ev.clientY <= context.canvas.height - (state.player.getMultiplier() * 2 + 10)) {
        state.player.setPosition(ev.clientX, ev.clientY);
    }
}

function onMouseClick(ev: MouseEvent) {
    if (!state.started) {
        state.score = 0;
        state.started = true;
        state.pickups = [];

        myMusic.play();
        myMusic.playbackRate = 0.5;
    }
}

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

function drawVisualizer() {
    const ctx = (document.getElementById('canvas') as HTMLCanvasElement).getContext('2d')!;

    ctx.fillStyle = getRandomColor();
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function run() {
    window.addEventListener('mousemove', (ev) => onMouseMove(ev));
    window.addEventListener('mouseenter', (ev) => onMouseMove(ev));
    window.addEventListener('mouseleave', (ev) => onMouseMove(ev));
    window.addEventListener('click', (ev) => onMouseClick(ev));

    setInterval(() => {
        drawVisualizer();

        context!.canvas.width = window.innerWidth;
        context!.canvas.height = window.innerHeight;
        context?.clearRect(0, 0, context.canvas.width + (state.player.getMultiplier() * 5), context.canvas.height + (state.player.getMultiplier() * 5));

        context!.fillStyle = '#dddddd';
        context!.textAlign = 'center';
        context!.font = "36px Arial";
        context!.fillText(`${state.score}`, (context.canvas.width) / 2, (context.canvas.height - 40) / 2);

        if (!state.started) {
            if (state.score > 0) {
                context!.font = "18px Arial";
                context!.fillStyle = '#ff0000';
                context!.textAlign = 'center';
                context!.fillText(`game over`, context.canvas.width / 2, context.canvas.height / 2);
                context!.fillStyle = '#000000';
                context!.fillText(`click anywhere to start...`, context.canvas.width / 2, (context.canvas.height + 40) / 2);
            } else {
                context!.font = "18px Arial";
                context!.textAlign = 'center';
                context!.fillText(`click anywhere to start...`, context.canvas.width / 2, context.canvas.height / 2);
                context!.fillStyle = '';
            }
            return;
        }

        context!.font = '12px Arial';
        context!.fillText(`${state.multiplier}x combo`, context.canvas.width / 2, (context.canvas.height - 15) / 2);

        let newState = {
            ...state,
        };

        // draw background

        newState = {
            ...newState,
            ...newState.player.update(state),
        }


        const type = Math.floor(Math.random() * 2);
    
        if (state.pickups.length < MAX_PICKUPS) {
            for (let i = state.pickups.length; i < MAX_PICKUPS; i++) {
                switch(type) {
                    case 0:
                        state.pickups.push(new EnemyPickup(state.score));
                        break;
                    case 1:
                        state.pickups.push(new ScorePickup(state.score));
                        break;
                }
            }
        }

        // update and render entities
        let index = 0;
        for (const pickup of state.pickups) {
            console.log('updating pickup');
            newState = {
                ...newState,
                ...pickup.update(state),
            }

            // detect collisions
            // top of bounding box
            const x1t = newState.player.getPosition()[0];
            const y1t = newState.player.getPosition()[1];

            const x2t = pickup.position[0];
            const y2t = pickup.position[1];

            // bottom of bounding box
            const x1b = newState.player.getPosition()[0] + (state.multiplier * 2 + 10);
            const y1b = newState.player.getPosition()[1] + (state.multiplier * 2 + 10);

            const x2b = pickup.position[0] + pickup.getRadius();
            const y2b = pickup.position[1] + pickup.getRadius();

            // || (x2b <= x1b && x2b >= x1t && y2b <= y1b && y2b >= y2b)
            if ((x2t >= x1t && x2t <= x1b && y2t >= y1t && y2t <= y1b)
            ) {
                // a collision happened...
                if (pickup instanceof EnemyPickup) {
                    newState.multiplier = 1;
                    newState.started = false;
                    myMusic.pause();
                    gameOverSound.play();
                } else {
                    newState.score += 10 * newState.multiplier;
                    newState.multiplier += 1;
                    myMusic.playbackRate = myMusic.playbackRate + 0.05;
                    pickupSound.play();
                }
                newState.pickups = [ ...newState.pickups.slice(0, index), ...newState.pickups.slice(index + 1) ];
                newState.player.setMultiplier(newState.multiplier);
            }

            // if off screen
            if (pickup.position[0] >= context.canvas.width || pickup.position[1] >= context.canvas.height || pickup.position[0] <= 0 || pickup.position[1] <= 0) {
                newState.pickups = [ ...newState.pickups.slice(0, index), ...newState.pickups.slice(index + 1) ];
            }

            state = newState;

            index++;
        }

        state = newState;
    }, 1000 / FPS);
}

run();
