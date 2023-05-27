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
}

class Euqlid extends Base {
    constructor(...params) {
        super(...params);
    }

    transform(...coords) {
        return super.transform(...coords);
    }
}

class Toroid extends Base {
    constructor(...params) {
        super(...params);
    }
}

export { Euqlid, Toroid };