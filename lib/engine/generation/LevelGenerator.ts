import * as engine from "../../engine";
import * as eta from "../../../eta";

interface Tree {
    leaf: Room;
    rchild: Tree;
    lchild: Tree;
}


interface Room {
    x: number;
    y: number;
    w: number;
    h: number;
    vert: boolean;
    doorCoord: number;
}

interface roomTree {
    ParentRooms: Room[];
    ChildRooms: Room[];
}

export default class levelGenerator {
    walls: engine.Wall[] = [];
    public generateRooms(w: number, h: number, iterations: number): engine.Wall[]{
        let map: Room = {
            x: 0,
            y: 0,
            w: w,
            h: h,
            vert: false,
            doorCoord: null
        };
        let tree: Tree = this.genTree(map, iterations);
        this.generateEntities(tree);
        this.addBoundries(map);
        return this.walls;
    }

    private genTree(container: Room, iterator: number): Tree{
        let root: Tree = {leaf: container, lchild: null, rchild: null};
        if(iterator != 0){
            let children: Room[] = this.randomSplit(container);
            root.lchild = this.genTree(children[0], iterator-1);
            root.rchild = this.genTree(children[1], iterator-1);
        }
        return root;
    }

    private randomSplit(room: Room): Room[]{
        let roomA: Room;
        let roomB: Room;
        if(this.getRand(0, 1) == 0){
            //vert
                roomA = {
                    x: room.x,
                    y: room.y,
                    w: Math.round(this.getPoint(room.w, room.doorCoord)),
                    h: room.h,
                    vert: true,
                    doorCoord: null
                };
                roomB = {
                    x: room.x + roomA.w,
                    y: room.y,
                    w: room.w - roomA.w,
                    h: room.h,
                    vert: true,
                    doorCoord: this.getRand(Math.round(roomA.h/3), Math.round(2*roomA.h/3))
                }
        } else {
            //horizontally
                roomA = {
                    x: room.x,
                    y: room.y,
                    w: room.w,
                    h: Math.round(this.getPoint(room.h, room.doorCoord)),
                    vert: false,
                    doorCoord: null
                };
                roomB = {
                    x: room.x,
                    y: room.y + roomA.h,
                    w: room.w,
                    h: room.h - roomA.h,
                    vert: false,
                    doorCoord: this.getRand(Math.round(roomA.w/3), Math.round(2*roomA.w/3)  )
                };
            }
        return [roomA, roomB];
    }

    private generateEntities(tree: Tree): void{
        for(let i: number = 0; i < tree.leaf.w; i++){
            this.walls.push(new engine.Wall({position: new engine.Vector2(tree.leaf.x + i, tree.leaf.y)}));
        }
        for(let i: number = 0; i < tree.leaf.h; i++){
            this.walls.push(new engine.Wall({position: new engine.Vector2(tree.leaf.x, tree.leaf.y + i)}));
        }
        if(tree.rchild){
            this.generateEntities(tree.rchild);
        }
        if(tree.lchild){
            this.generateEntities(tree.lchild);
        }
    }

    private addBoundries(map: Room){
        for(let i: number = 0; i < map.h; i++){
            this.walls.push(new engine.Wall({position: new engine.Vector2(map.w - 1, i)}));
        }
        for(let i: number = 0; i < map.w; i++){
            this.walls.push(new engine.Wall({position: new engine.Vector2(i, map.h -1)}));
        }
    }

    private getRand(lower: number, upper: number): number{
        return Math.floor(Math.random() * (upper - lower + 1)) + lower;
    }

    private getPoint(limiter: number, check: number): number {
        let coord: number;
        while(true){
            coord = this.getRand(limiter/3, 2*limiter/3);
            if(coord != check){
                break;
            }
        }
        return coord;
    }
}
