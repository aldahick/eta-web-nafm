import * as ndarray from "ndarray";

declare namespace BSPTree {
    interface BSP {
        (size: number, repr?: any): Leaf;
    }

    interface Leaf {
        data: ndarray.Data<number>;
        dir: boolean;
        leafs: Leaf[];
        split(vertical?: boolean): Leaf;
        merge(): void;
        flip(): void;
    }
}

declare module "bsp-tree" {
    let bsp: BSPTree.BSP;
    export = bsp;
}
