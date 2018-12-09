import { Entity, EntityKind } from "./../../../core/domain";
import { Point, Size } from '../../../core/geometry';
import Element from './../../Element';

class Enumeration extends Element implements Entity {
  kind = EntityKind.Enumeration;
  attributes = [];
  methods = [];
  renderMode = { showAttributes: true, showMethods: true };

  constructor(public name: string, public position: Point, public size: Size) {
    super();
  }
}

export default Enumeration;
