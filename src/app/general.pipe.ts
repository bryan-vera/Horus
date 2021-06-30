import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';


@Pipe({
    name: 'ordenar'
})

export class GeneralPipe implements PipeTransform {
    transform(array,args) {
        return _.sortBy(array, args);
    }
}