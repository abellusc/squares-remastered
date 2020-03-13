import { IApplicationState } from "./IApplicationState";

export interface IRenderable {
    position: [number, number]; // center point y coord of the rectangle
    update(state: IApplicationState): IApplicationState;
}