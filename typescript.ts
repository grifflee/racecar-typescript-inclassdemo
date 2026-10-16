// # setup: lets TypeScript use Node's keyboard input without installing packages
declare const process: any;
declare function require(name: string): any;
const rl = require("node:readline/promises").createInterface({ input: process.stdin, output: process.stdout });

// # literal types + type alias
// only specific values allowed
// only restricted at compile time checking
type Fuel = "gasoline" | "diesel" | "jet";

// # union type + type alias
// one kind of type or another
type CarName = string | number;

// # enums
// choices for color, actually stays as JS object after compile
enum Color { Red = "red", Blue = "blue", Black = "black" } // car.color = Color.Red NOT "red"

// # interface
interface RaceCar {
  name: CarName; // union rule reused by aliasing
  fuel: Fuel;
  color: Color;
  wheelType?: string; // # optional field
}

async function main() {
  // # type annotations
  const nameInput: string = await rl.question("Car name or number: ");
  const name: CarName = isNaN(Number(nameInput)) ? nameInput : Number(nameInput);

  // # narrowing: once the loop ends, TypeScript knows fuel is a Fuel and gives it the correct label
  let fuel: string = await rl.question("Fuel (gasoline / diesel / jet): ");
  while (fuel !== "gasoline" && fuel !== "diesel" && fuel !== "jet") {
    fuel = await rl.question("  Pick gasoline, diesel, or jet: ");
  }

  // # narrowing: once the loop ends, TypeScript knows color is a Color and gives correct label
  // 
  let color: string = await rl.question("Color (red / blue / black): ");
  while (color !== Color.Red && color !== Color.Blue && color !== Color.Black) {
    color = await rl.question("  Pick red, blue, or black: ");
  }

  const wheels: string = await rl.question("Wheel type (press Enter to skip): ");

  // # interface: fill it in
  const car: RaceCar = { name, fuel, color };
  if (wheels !== "") car.wheelType = wheels; // # optional field: only set if typed

  console.log(`\nBuilt ${car.name}: ${car.color} car, ${car.fuel} fuel, ${car.wheelType ?? "standard"} wheels\n`);

  // # type inference: TypeScript sees 0 and decides distance is a number
  let distance = 0;
  while (true) {
    const input: string = await rl.question("Miles to drive (or 'quit'): ");
    if (input === "quit") break;

    const miles: number = Number(input); // # number: one type for ints and decimals
    if (isNaN(miles)) continue;

    distance += miles;
    console.log(`  ${car.name} (${car.color}, ${car.fuel}) drove ${miles} miles. Total: ${distance} miles from home`);
  }

  rl.close();
  console.log(`\nFinished the race ${distance} miles from home!`);
  finishRace();
}

// # any: turns type checking off, so no red line here, but it crashes when it runs
function finishRace() {
  const mysteryCar: any = { name: "Ghost" }; // passes the type check, but then when running this gives an error
                                                // other fields arent filled in properly (no fuel defined)
  console.log(mysteryCar.fuel.toUpperCase()); //trying to call on fuel
}

main();
