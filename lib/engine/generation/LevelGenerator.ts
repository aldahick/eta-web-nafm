import Entity from "../Entity"

interface Room {
    x: number;
    y: number;
    w: number;
    h: number;
    vert: boolean;
    doorCoord: number;
}

export function generateRooms(w: number, h: number): Room[]{
    let p2, p3, p4, p5, p6, p7: number;
    let map: Room = {x: 0, y: 0, w: w, h: h, vert: null, doorCoord: null};
    let p1: number = getRand(map.x/3, 2*map.x/3);
    //map children, 2 partitions, split vertically
    let A: Room = {x: 0, y: 0, w: p1, h: map.h, vert: true, doorCoord: null};
    let B: Room = {x: p1, y: 0, w: (A.x - p1), h: map.h, vert: true, doorCoord: getRand(map.h/3, 2*map.h/3)};
    p2 = getPoint(A.w, B.doorCoord);
    //A children, 2 partitions, split horizontally
    let C: Room = {x: 0, y: 0, w: A.w, h: p2, vert: false, doorCoord: null};
    let D: Room = {x: 0, y: p2, w: A.w, h: A.h - p2, vert: false, doorCoord: getRand(p2/3, 2*p2/3)};
    p3 = getPoint(B.h, B.doorCoord);
    //B Children, 2 partitions, split horizontally
    let E: Room = {x: B.x, y: B.y, w: B.w, h: p3, vert: false, doorCoord: null};
    let F: Room = {x: B.x, y: p3, w: B.w, h: B.h - p3, vert: false, doorCoord: getRand(p3/3, 2*p3/3)};
    p4 = getPoint(C.w, D.doorCoord);
    p5 = getPoint(D.w, D.doorCoord);
    //C Children, split vertically, 2 partitions
    let G: Room = {x: C.x, y: C.y, w: p4, h: C.h, vert: true, doorCoord: null};
    let H: Room = {x: p4, y: C.y, w: C.w - p4, h: C.h, vert: true, doorCoord: getRand(p4/3, 2*p4/3)};
    //D Children, split vertically, 2 partitions
    let I: Room = {x: C.x, y: p2, w: p5, h: D.h, vert: true, doorCoord: null};
    let J: Room = {x: p5, y: p2, w: D.w - p5, h: D.h, vert: true, doorCoord: getRand(p5/3, 2*p5/3)};
    p6 = getPoint(E.w, F.doorCoord);
    p7 = getPoint(F.w, F.doorCoord);
    //E Children, split veritcally, 2 partitions
    let K: Room = {x: E.x, y: E.y, w: p6, h: E.h, vert: true, doorCoord: null};
    let L: Room = {x: p6, y: E.y, w: E.w - p6, h: E.h, vert: true, doorCoord: getRand(p6/3, 2*p6/3)};
    //F Children, split vertically, 2 partitions
    let M: Room = {x: F.x, y: F.y, w: p7, h: F.h, vert: true, doorCoord: null};
    let N: Room = {x: p7, y: F.y, w: F.w - p7, h: F.h, vert: true, doorCoord: getRand(p7/3, 2*p7/3)};
    return null;
}

function getRand(lower: number, upper: number): number{
    return Math.round(Math.floor(Math.random() * lower) + upper);
}

function getPoint(limiter: number, check: number): number {
    let coord: number;
    while(true){
        coord = getRand(limiter/3, 2*limiter/3);
        if(limiter = check) break;
    }
    return coord;
}
