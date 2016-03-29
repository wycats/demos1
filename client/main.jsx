'use strict';

import 'styles/main.scss';

import React from 'react';
import { render } from 'react-dom';

import Index from 'components/Index/Index';
import UptimeBoxesDemo from 'components/UptimeBoxesDemo/Index';

const Demos = {
  '?uptime-boxes': UptimeBoxesDemo
};

let Demo = Demos[window.location.search] || Index;

console.time('Initial render');
render(<Demo />, document.getElementById('js-main'));
console.timeEnd('Initial render');
