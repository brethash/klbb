import { PhysicsConstructor } from '../interfaces/physics.interface';

export class Physics {
    private _bounceX: number = 0;
    private _bounceY: number = 0;
    private _velocityX: number = 0;
    private _velocityY: number = 0;
    private _colliderWorldBounds: boolean = false;

    constructor(params: PhysicsConstructor) {
        if (params.bounceX) {
            this.bounceX = params.bounceX;
        }
        if (params.bounceY) {
            this.bounceY = params.bounceY;
        }
        if (params.velocityX) {
            this.velocityX = params.velocityX;
        }
        if (params.velocityY) {
            this.velocityY = params.velocityY;
        }
        if (params.colliderWorldBounds) {
            this.colliderWorldBounds = params.colliderWorldBounds;
        }
    }

    get colliderWorldBounds(): boolean {
        return this._colliderWorldBounds;
    }

    set colliderWorldBounds(value: boolean) {
        this._colliderWorldBounds = value;
    }
    get bounceY(): number {
        return this._bounceY;
    }

    set bounceY(value: number) {
        this._bounceY = value;
    }
    get bounceX(): number {
        return this._bounceX;
    }

    set bounceX(value: number) {
        this._bounceX = value;
    }
    get velocityY(): number {
        return this._velocityY;
    }

    set velocityY(value: number) {
        this._velocityY = value;
    }
    get velocityX(): number {
        return this._velocityX;
    }

    set velocityX(value: number) {
        this._velocityX = value;
    }

}
