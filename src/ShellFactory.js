import Shell from './Shell.js';

class ShellFactory {
  makeShell(tank) {
    const shell = new Shell();

    const position = tank.position.clone();

    // When tank is turned to the right/left, the shell is rotated, which means
    // it's width and height will be swapped. Use width and height as the
    // shell we be faced up.
    // TODO: improve rotation logic (width and height swap)

    if (tank.direction === 'up') {
      position.add(0, -tank.height / 2);
    } else if (tank.direction === 'down') {
      position.add(0, tank.height / 2);
    } else if (tank.direction === 'right') {
      position.add(tank.width / 2, 0);
    } else if (tank.direction === 'left') {
      position.add(-tank.width / 2, 0);
    }

    shell.position = position;
    shell.rotate(tank.direction);

    return shell;
  }
}

export default ShellFactory;
