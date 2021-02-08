const blessed = require('@blessed/neo-blessed');

const screen = blessed.screen({ fullUnicode: true });

const options = require('minimist')(process.argv.slice(2));
const scheme = options.theme || 'Dracula';
const colors = require(`@blessed/themes/themes/${scheme}`);
const theme = require('./styles')(colors.colors);
const si = require('systeminformation');

module.exports = function () {
  const program = blessed.program();
  program.bg(theme.program.bg);
  program.fg(theme.program.fg);

  const leftBox = blessed.box({
    parent: screen,
    content: 'Logo',
    top: '0',
    left: '0',
    width: '50%',
    height: '100%',
    border: theme.box.border,
    style: theme.box.style,
  });

  const rightBox = blessed.box({
    parent: screen,
    content: 'Info',
    top: '0',
    left: '50%+1',
    width: '50%',
    height: '100%',
    border: theme.box.border,
    style: theme.box.style,
  });

  screen.key(['q'], () => {
    return process.exit(0); // eslint-disable-line
  });

  screen.append(leftBox);
  screen.append(rightBox);

  let info = '';
  info += `Uptime: \n`;
  info += `Packages: \n`;
  info += `Shell: \n`;
  info += `DE: \n`;
  info += `WM: \n`;
  info += `WM theme: \n`;

  const valueObject = {
    system: 'model',
    cpu: 'manufacturer, brand, cores, speed',
    osInfo: 'codename, release, build, arch, kernel',
    mem: 'used, total',
    graphics: '*',
  };

  si.get(valueObject).then((data) => {
    console.log(data);

    const {
      system: { model },
      cpu: { manufacturer, brand, cores, speed },
      osInfo: { codename, release, build, arch, kernel },
      mem: { used, total },
      graphics: { controllers, displays },
    } = data;

    const gpus = controllers.map((c) => c.model).join(', ');
    info += `OS: ${codename} ${release} ${build} ${arch}\n`;
    info += `Host: ${model}\n`;
    info += `Kernel: ${kernel}\n`;
    info += `Resolution: ${displays[0].resolutionX}x${displays[0].resolutionY}\n`;
    info += `CPU: ${manufacturer} ${brand} (${cores}) @ ${speed}GHz\n`;
    info += `GPU: ${gpus}\n`;
    info += `Memory: ${used} / ${total}\n`;

    rightBox.content = info;
    screen.render();
  });

  screen.render();
};
