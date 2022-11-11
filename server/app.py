import asyncio
import json
import websockets


connected = {}
players = {}


class Player:
    def __init__(self, id, name,skin):
        self.id = id
        self.name = name
        self.x = 0
        self.y = 0
        self.z = 0
        self.skin = skin


    def json(self):
        data = {"id": self.id, "name": self.name, "x": self.x, "y": self.y,"skin":self.skin}
        return data


async def play(websocket, name):
    id = str(websocket.id)
    async for message in websocket:
        event = json.loads(message)
        if(event["type"]=="playerMoved"):
            players[id].x = event["x"]
            players[id].y = event["y"]
            event = {"type": "playerMoved", "id": id, "name": players[id].name, "x": players[id].x, "y": players[id].y}
            websockets.broadcast(connected, json.dumps(event))
            #print(players[id].name+str(players[id].x)+str(players[id].y))
        elif((event["type"]=="emoji")):
            emoji = event["emoji"]
            event = {"type": "emoji", "id": id, "emoji": emoji}
            websockets.broadcast(connected, json.dumps(event))


async def initialize(websocket, name,skin):
    global connected
    if not connected:
        connected = {websocket}
    else:
        connected.add(websocket)

    print(name + " is online!")

    
    id = str(websocket.id)
    newPlayer = Player(id, name,skin)
    players[id] = newPlayer

    event = {
        "type": "playerData",
        "id": str(id),
        "name": name,
        "skin": skin,
        "players": [players[player].json() for player in players],
    }
    await websocket.send(json.dumps(event))
    event = {"type": "playerJoined", "player": newPlayer.json()}
    websockets.broadcast(connected, json.dumps(event))

    try:
        await play(websocket, name)
    finally:
        print(name + "disconnect")
        event = {"type": "killPlayer", "id": str(id), "name": name}

        websockets.broadcast(connected, json.dumps(event))
        connected.remove(websocket)
        del players[id]


async def handler(websocket):
    message = await websocket.recv()
    event = json.loads(message)
    print(event)
    if "initialize" == event["type"]:
        await initialize(websocket, event["name"],event["skin"])


async def main():
    async with websockets.serve(handler, "", 8001):
        await asyncio.Future()  # run forever


if __name__ == "__main__":
    asyncio.run(main())
