class Base {
    constructor(parentTopology = null) {
        this.parentTopology = parentTopology;
    }

    transform(...coords) {
        if (this.parentTopology) {
            return this.parentTopology.transform(...coords);
        }
        return coords;
    }

    get isBounded() {
        return false;
    }

    get boundRect() {
        return undefined;
    }

    get name() {
        return undefined;
    }
}

class Euqlid extends Base {
    transform(...coords) {
        return super.transform(...coords);
    }

    get name() {
        return "euqlid";
    }
}

class Toroid2d extends Base {
    constructor(width, height, ...params) {
        super(...params);
        this.width = width;
        this.height = height;
    }

    transform(x, y) {
        const [rX, rY] = super.transform(x, y);

        return [
            (rX % this.width + this.width) % this.width,
            (rY % this.height + this.height) % this.height
        ];
    }

    get isBounded() {
        return true;
    }

    get boundRect() {
        return { width: this.width, height: this.height };
    }

    get name() {
        return "toroid2d";
    }
}

export { Euqlid, Toroid2d };