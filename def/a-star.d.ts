declare function aStar<Node>(options: {
    start: Node;
    isEnd: (node: Node) => boolean;
    neighbor: (node: Node) => Node[];
    distance: (a: Node, b: Node) => number;
    heuristic: (node: Node) => number;
    hash: (node: Node) => string;
    timeout?: number;
}): {
    status: "success" | "noPath" | "timeout";
    path: Node[];
    cost: number;
};

declare module "a-star" {
    let a: <Node>(options: {
        start: Node;
        isEnd: (node: Node) => boolean;
        neighbor: (node: Node) => Node[];
        distance: (a: Node, b: Node) => number;
        heuristic: (node: Node) => number;
        hash: (node: Node) => string;
        timeout: number;
    }) => {
        status: "success" | "noPath" | "timeout";
        path: Node[];
        cost: number;
    };
    export = a;
}
