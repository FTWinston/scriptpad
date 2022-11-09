import concat from './concat';
import distinct from './distinct';
import filter from './filter';
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
    filter,
    distinct,
};

export const conversionFunctions = {
    split,
    join,
};