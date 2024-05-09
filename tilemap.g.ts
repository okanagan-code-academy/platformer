// Auto-generated code. Do not edit.
namespace myTiles {
    //% fixedInstance jres blockIdentity=images._tile
    export const transparency16 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile1 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile3 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile4 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile5 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile10 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile12 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile13 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile2 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile6 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile7 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile11 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile8 = image.ofBuffer(hex``);

    helpers._registerFactory("tilemap", function(name: string) {
        switch(helpers.stringTrim(name)) {
            case "testLevel":
            case "testLevel1":return tiles.createTilemap(hex`0a000e000101010101010101010101000000000000000001010000000000000000010100000000000000000101000000000000000001010000000000000000010100000000000000000101000000000000000001010000000000000000010100000000000000000101000000000000000101010000000000000101010100000000000101010101010101010101010101`, img`
2 2 2 2 2 2 2 2 2 2 
2 . . . . . . . . 2 
2 . . . . . . . . 2 
2 . . . . . . . . 2 
2 . . . . . . . . 2 
2 . . . . . . . . 2 
2 . . . . . . . . 2 
2 . . . . . . . . 2 
2 . . . . . . . . 2 
2 . . . . . . . . 2 
2 . . . . . . . 2 2 
2 . . . . . . 2 2 2 
2 . . . . . 2 2 2 2 
2 2 2 2 2 2 2 2 2 2 
`, [myTiles.transparency16,myTiles.tile1], TileScale.Sixteen);
            case "test":
            case "test1":return tiles.createTilemap(hex`12000e000a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a000500000000000000000000000000000a0a000000000000000000020000000002000a0a000000000000000200000000000000000a0a000000020000000000090200000101010a0a000000000900000003010100000000000a0a000000030100000000000200000000000a0a000200000000000000000000000000060a0a080000000200000002000002000000060a0a010100000009000000020000000000020a0a070000030101020001030100000000000a0a070002000000000000000000000101010a0a000000000000000000000404000000000a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a`, img`
2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 
2 . . . . . . . . . . . . . . . . 2 
2 . . . . . . . . . . . . . . . . 2 
2 . . . . . . . . . . . . . . . . 2 
2 . . . . . . . . . . . . . 2 2 2 2 
2 . . . . . . . . 2 2 2 . . . . . 2 
2 . . . 2 2 . . . . . . . . . . . 2 
2 . . . . . . . . . . . . . . . . 2 
2 . . . . . . . . . . . . . . . . 2 
2 2 2 . . . . . . . . . . . . . . 2 
2 . . . 2 2 2 . . 2 2 2 . . . . . 2 
2 . . . . . . . . . . . . . 2 2 2 2 
2 . . . . . . . . . . . . . . . . 2 
2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 
`, [myTiles.transparency16,myTiles.tile1,myTiles.tile2,myTiles.tile3,myTiles.tile10,myTiles.tile11,myTiles.tile12,myTiles.tile13,myTiles.tile6,myTiles.tile7,myTiles.tile8], TileScale.Sixteen);
        }
        return null;
    })

    helpers._registerFactory("tile", function(name: string) {
        switch(helpers.stringTrim(name)) {
            case "transparency16":return transparency16;
            case "stoneUnbreakable":
            case "tile1":return tile1;
            case "luckyTile":
            case "tile3":return tile3;
            case "depletedTile":
            case "tile4":return tile4;
            case "transparentTile":
            case "tile5":return tile5;
            case "bottomHazardTile":
            case "tile10":return tile10;
            case "rightHazardTile":
            case "tile12":return tile12;
            case "leftHazardTile":
            case "tile13":return tile13;
            case "collectibleSpawn":
            case "tile2":return tile2;
            case "spawnTile":
            case "tile6":return tile6;
            case "checkPointTile":
            case "tile7":return tile7;
            case "topHazardTile":
            case "tile11":return tile11;
            case "myTile":
            case "tile8":return tile8;
        }
        return null;
    })

}
// Auto-generated code. Do not edit.
