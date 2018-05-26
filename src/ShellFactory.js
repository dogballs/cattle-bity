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
      position.add(tank.width / 2 - shell.width / 2, -shell.height);
    } else if (tank.direction === 'down') {
      position.add(tank.width / 2 - shell.width / 2, tank.height);
    } else if (tank.direction === 'right') {
      position.add(tank.width, tank.height / 2 - shell.width / 2);
    } else if (tank.direction === 'left') {
      position.add(-shell.height, tank.height / 2 - shell.width / 2);
    }

    shell.position = position;

    // TODO: improve direction and sprite change
    shell.direction = tank.direction;
    shell.sprite = shell.sprites[shell.direction];

    return shell;
  }
}

export default ShellFactory;
