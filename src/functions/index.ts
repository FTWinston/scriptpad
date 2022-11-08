import concat from './concat';
import insert from './insert';
import join from './join';
import replace from './replace';
import split from './split';
import substring from './substring';

export const textFunctions = {
    replace,
    concat,
    insert,
    substring,
};

export const sequenceFunctions = {
    replace // TODO: remove
};

export const conversionFunctions = {
    split,
    join,
};