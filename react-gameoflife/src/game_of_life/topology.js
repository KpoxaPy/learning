class Base {
    constructor(parentTopology = null) {
        this.parentTopology = parentTopology;
    }

    transformX(x) {
        return undefined;
    }

    transformY(y) {
        return undefined;
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

    transformX(x) {
        return (x % this.width + this.width) % this.width;
    }

    transformY(y) {
        return (y % this.height + this.height) % this.height;
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