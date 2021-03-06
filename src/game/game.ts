import { IApplicationState } from "./interfaces/IApplicationState";
import { Player } from "./interfaces/Player";
import { EnemyPickup } from "./interfaces/EnemyPickup";
import { ScorePickup } from "./interfaces/ScorePickup";
import { PowerPickup } from "./interfaces/PowerPickup";

const FPS = 60;
const context = (document.getElementById('canvas') as HTMLCanvasElement).getContext('2d');
const MAX_PICKUPS = 20;

const myMusic = document.getElementById("music") as HTMLAudioElement;
const gameOverSound = document.getElementById("gameoversound") as HTMLAudioElement;
const pickupSound = document.getElementById("pickupsound") as HTMLAudioElement;
pickupSound.playbackRate = 3.0;

const initialState: IApplicationState = {
    started: false,
    player: new Player(),
    pickups: [],
    score: 0,
    multiplier: 1,
    invincible: 0,
    mini: 0,
    roundsPlayed: 0,
};

let state: IApplicationState = {
    started: false,
    player: new Player(),
    pickups: [],
    score: 0,
    multiplier: 1,
    invincible: 0,
    mini: 0,
    roundsPlayed: 0,
};

function onMouseMove(ev: MouseEvent) {
    if (ev.clientX >= 0 && ev.clientY >= 0 && ev.clientX <= context.canvas.width - (state.player.getMultiplier() * 2 + 10) && ev.clientY <= context.canvas.height - (state.player.getMultiplier() * 2 + 10)) {
        state.player.setPosition(ev.clientX, ev.clientY);
    }
}

function onTouchMove(ev: TouchEvent) {
    if (ev.touches.item(0).clientX >= 0 && ev.touches.item(0).clientY >= 0 && ev.touches.item(0).clientX <= context.canvas.width - (state.player.getMultiplier() * 2 + 10) && ev.touches.item(0).clientY <= context.canvas.height - (state.player.getMultiplier() * 2 + 10)) {
        state.player.setPosition(ev.touches.item(0).clientX, ev.touches.item(0).clientY);
    }
}

function onMouseClick(ev: MouseEvent) {
    if (!state.started) {
        state.roundsPlayed++;
        state.score = 0;
        state.multiplier = 1;
        state.mini = 0;
        state.invincible = 0;
        state.started = true;

        myMusic.play();
        myMusic.playbackRate = 0.5;
    }
}

function onMouseDoubleClick(ev: MouseEvent) {
    if (state.score >= 10 && state.multiplier > 1) {
        // is started, allow releasing of orbs
        state.score = state.score - 10;
        state.multiplier--;
        state.player.setMultiplier(state.multiplier);

        releaseScorePickup();
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
    const ctx = (document.getElementById('canvas') as HTMLCanvasElement).getContext('2d');

    ctx!.strokeStyle = getRandomColor();
    ctx!.moveTo(state.player.position[0] + ((state.player.mini ? 10 : state.player.getMultiplier() * 2 + 10) / 2), state.player.position[1] + ((state.player.mini ? 10 : state.player.getMultiplier() * 2 + 10) / 2));
    const target = state.pickups[Math.floor(Math.random() * state.pickups.length)];
    ctx!.lineTo(target.position[0], target.position[1]);
    ctx!.stroke();
    ctx!.fillStyle = '#000000';
}

function getRandomPositionOffsetFromPlayer(): [number, number] {
    switch (Math.floor(Math.random() * 8)) {
        case 0: return [10, 0];
        case 1: return [10, 10];
        case 2: return [10, -10];
        case 3: return [0, 10];
        case 4: return [0, -10];
        case 5: return [-10, -10];
    }
}

function releaseScorePickup(): void {
    const offset = getRandomPositionOffsetFromPlayer();
    state.pickups.push(new ScorePickup(state.score, [
        state.player.position[0] + offset[0],
        state.player.position[1] + offset[1]
    ], offset));
}

function onTouchStart(ev: TouchEvent) {
    if (!state.started) {
        state.roundsPlayed++;
        state.score = 0;
        state.multiplier = 1;
        state.mini = 0;
        state.invincible = 0;
        state.started = true;

        myMusic.play();
        myMusic.playbackRate = 0.5;
    } else {
        onTouchMove(ev);
    }
}

function run() {
    window.addEventListener('mousemove', (ev) => onMouseMove(ev));
    window.addEventListener('mouseup', (ev) => onMouseMove(ev));
    window.addEventListener('mousedown', (ev) => onMouseMove(ev));
    window.addEventListener('mouseenter', (ev) => onMouseMove(ev));
    window.addEventListener('mouseleave', (ev) => onMouseMove(ev));
    window.addEventListener('touchstart', (ev) => onTouchStart(ev));
    window.addEventListener('touchend', (ev) => onTouchMove(ev));
    window.addEventListener('touchmove', (ev) => onTouchMove(ev));
    window.addEventListener('click', (ev) => onMouseClick(ev));
    window.addEventListener('dblclick', (ev) => onMouseDoubleClick(ev));

    let frame = 0;
    let powerupsOnBoard = 0;
    let bestScore = 0;

    setInterval(() => {
        const renderTime = new Date().getTime();
        context!.canvas.width = window.innerWidth;
        context!.canvas.height = window.innerHeight;
        context!.fillStyle = '#000000';
        context?.fillRect(0, 0, context.canvas.width + (state.player.getMultiplier() * 5), context.canvas.height + (state.player.getMultiplier() * 5));

        if (!state.started) {
            context!.fillStyle = '#dddddd';
            if (state.roundsPlayed > 0) {
                context!.fillStyle = '#dddddd';
                context!.textAlign = 'center';
                context!.font = "36px Arial";
                context!.fillText(`${state.score}`, (context.canvas.width) / 2, (context.canvas.height - 40) / 2);

                context!.font = "18px Arial";
                context!.fillStyle = '#ff0000';
                context!.textAlign = 'center';
                context!.fillText(`game over`, context.canvas.width / 2, context.canvas.height / 2);
                context!.fillStyle = '#000000';
                context!.fillText(`click anywhere to start...`, context.canvas.width / 2, (context.canvas.height + 40) / 2);

                if (state.score > bestScore) {
                    bestScore = state.score;
                }

                context!.font = "10px Arial";
                context!.fillStyle = '#dddddd';
                context!.textAlign = 'center';
                context!.fillText(`best score: ${bestScore}`, context.canvas.width / 2, (context.canvas.height + 80) / 2);

            } else {
                context.textAlign = 'center';
                context!.font = '72px Arial';
                context!.fillText('squares: remastered', context.canvas.width / 2, context.canvas.height / 2 - 100)
                context!.font = "18px Arial";
                context!.textAlign = 'center';
                context!.fillText(`click anywhere to start...`, context.canvas.width / 2, context.canvas.height / 2);

                context!.fillText(`move your mouse to COLLECT the white and blue squares`, context.canvas.width / 2, (context.canvas.height + 25) / 2);
                context!.fillText(`AVOID the red squares`, context.canvas.width / 2, (context.canvas.height + 50) / 2);
                context!.fillText(`double click to release some points and reduce your square size`, context.canvas.width / 2, (context.canvas.height + 75) / 2);
                context!.fillStyle = '';
            }
            return;
        }

        context!.fillStyle = '#dddddd';
        context!.textAlign = 'center';
        context!.font = "36px Arial";
        context!.fillText(`${state.score}`, (context.canvas.width) / 2, (context.canvas.height - 40) / 2);

        if (frame % Math.floor(10 / myMusic.playbackRate) === 0) {
            for (let i = 0; i < Math.floor((3 * myMusic.playbackRate)) - 1; i++) {
                drawVisualizer();
            }
        }

        context!.fillStyle = '#dddddd';
        context!.font = '12px Arial';
        context!.fillText(`${state.multiplier}x combo`, context.canvas.width / 2, (context.canvas.height - 15) / 2);
        
        let powers = [];
        if (state.invincible > renderTime) {
            powers.push(`GOD MODE (${(Math.floor((state.invincible - renderTime) / 1000))})`);
        }
        if (state.mini > renderTime) {
            powers.push(`MINI MODE (${(Math.floor((state.mini - renderTime) / 1000))})`);
        }

        context!.fillText(powers.join(' | '), context.canvas.width / 2, (context.canvas.height + 45) / 2);


        let newState = {
            ...state,
        };

        // draw background

        newState = {
            ...newState,
            ...newState.player.update(state),
        }


        if (state.invincible > renderTime) {
            newState.player.color = getRandomColor();
        } else {
            newState.player.color = '#aaaaaa';
        }

        newState.player.mini = state.mini > renderTime;

        const type = Math.floor(Math.random() * 10);
    
        if (state.pickups.length < MAX_PICKUPS) {
            for (let i = state.pickups.length; i < MAX_PICKUPS; i++) {
                switch(type) {
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                        state.pickups.push(new EnemyPickup(state.score));
                        break;
                    case 5:
                    case 6:
                    case 7:
                    case 8:
                        state.pickups.push(new ScorePickup(state.score));
                        break;
                    case 9:
                        if (powerupsOnBoard === 0) {
                            state.pickups.push(new PowerPickup(state.score));
                            powerupsOnBoard++;
                        } else {
                            state.pickups.push(new ScorePickup(state.score));
                        }
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
            const x1b = newState.player.getPosition()[0] + (newState.player.mini ? 10 : (state.multiplier * 2 + 10));
            const y1b = newState.player.getPosition()[1] + (newState.player.mini ? 10 : (state.multiplier * 2 + 10));

            const x2b = pickup.position[0] + pickup.getRadius();
            const y2b = pickup.position[1] + pickup.getRadius();

            // || (x2b <= x1b && x2b >= x1t && y2b <= y1b && y2b >= y2b)
            if ((x2t >= x1t && x2t <= x1b && y2t >= y1t && y2t <= y1b)
            ) {
                // a collision happened...
                if (pickup instanceof EnemyPickup) {
                    if (state.invincible < renderTime) {
                        newState.multiplier = 1;
                        newState.started = false;
                        myMusic.pause();
                        gameOverSound.play();
                    }
                } else if (pickup instanceof ScorePickup) {
                    newState.score += (30 - pickup.getRadius()) * newState.multiplier;
                    newState.multiplier += 1;
                    myMusic.playbackRate = myMusic.playbackRate + 0.05;
                    pickupSound.play();
                } else if (pickup instanceof PowerPickup) {
                    const n = Math.floor(Math.random() * 2);

                    switch (n) {
                        case 0:
                            newState.invincible = renderTime + 10000;
                            break;
                        case 1:
                            newState.mini = renderTime + 10000;
                    }

                    powerupsOnBoard--;

                    pickupSound.play();
                }
                newState.pickups = [ ...newState.pickups.slice(0, index), ...newState.pickups.slice(index + 1) ];
                newState.player.setMultiplier(newState.multiplier);
            }

            // if off screen
            if (pickup.position[0] >= context.canvas.width || pickup.position[1] >= context.canvas.height || pickup.position[0] <= 0 || pickup.position[1] <= 0) {

                if (pickup instanceof PowerPickup) {
                    powerupsOnBoard--;
                }

                newState.pickups = [ ...newState.pickups.slice(0, index), ...newState.pickups.slice(index + 1) ];
            }

            state = newState;

            index++;
        }

        state = newState;
        frame++;

        if (frame >= FPS) {
            frame = 0;
        }
    }, 1000 / FPS);
}

run();
