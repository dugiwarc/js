function pathFinder(area) {
    if (area.length === 1) return 0
    const zone = area.split('\n').map(x => x.split(''))
    const n = zone.length, coordDists = {}, q = [ [0,0,0] ], ext = new Set()
    for (let r = 0; r < n; r++)
        for (let c = 0; c < n; c++)
            coordDists[r+':'+c] = 1e9
            
    const distanceToGoal =(row,col)=> ((n-1-row)**2 + (n-1-col)**2)**0.5
    let result = 1e9
    while (q.length) {
        q.sort((a,b)=>a[0]-b[0])
        let p = q.shift(), r = p[1], c = p[2]
        ext.add(r+':'+c)
        for (let d of [[1,0],[-1,0],[0,1],[0,-1]]) {
            let R = r+d[0], C = c+d[1]
            if (0 <= R&&R < n && 0 <= C&&C < n && !ext.has(R+':'+C)) {
                let traversalCost = Math.abs(+zone[R][C] - +zone[r][c])
                let totalDist = traversalCost + p[0]
                if (totalDist >= coordDists[R+':'+C]) continue
                coordDists[R+':'+C] = totalDist
                q.push([totalDist,R,C])
            }
        }
    }
    return coor