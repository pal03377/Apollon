import React from 'react';
import { EntityRenderMode } from './../../../core/domain';
import { Point, Size } from '../../../core/geometry';
import Element from './../../Element';
import Member, { EntityMember } from './/Member';
import { EditorMode } from '../../Options/types';
import uuid from './../../utils/uuid';

class AbstractClass extends Element {
  attributes: EntityMember[] = [{ id: uuid(), name: "attribute1" }];
  methods: EntityMember[] = [{ id: uuid(), name: "method1()" }];
  renderMode: EntityRenderMode = { showAttributes: true, showMethods: true };

  constructor(public name: string = 'AbstractClass', public position: Point, public size: Size) {
    super(name);
  }

  public render(options: any): JSX.Element {
    const { width, height } = this.bounds;
    const headerHeight = 35;
    const memberHeight = 25;
    let currentY = headerHeight - memberHeight;

    const { editorMode, hover, interactiveElementIds, interactiveElementsMode, theme, toggleInteractiveElements } = options;
    
    return (
      <svg id={`abstractclass-${this.id}`} width={width} height={height} style={{ overflow: 'visible' }}>
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill={
            editorMode === EditorMode.InteractiveElementsView &&
            (hover ||
              interactiveElementIds.has(this.id))
              ? theme.interactiveAreaColor
              : 'white'
          }
          stroke="black"
        />
        <svg width={width} height={headerHeight}>
          <rect width="100%" height="100%" fill="none" />
          <g transform="translate(0, -1)">
            <rect x="0" y="100%" width="100%" height="1" fill="black" />
          </g>
          <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="black" fontStyle="italic">
            {this.name}
          </text>
        </svg>


        {this.renderMode.showAttributes &&
          this.attributes.map((attribute: EntityMember) => {
            currentY += memberHeight;
            return (
              <Member
                y={currentY}
                key={attribute.id}
                entity={this}
                member={attribute}
                editorMode={editorMode}
                interactiveElementsMode={interactiveElementsMode}
                canBeMadeInteractive={
                  !interactiveElementIds.has(this.id)
                }
                isInteractiveElement={interactiveElementIds.has(attribute.id)}
                onToggleInteractiveElements={() => {
                  toggleInteractiveElements(attribute.id);
                }}
              />
            );
          })
        }

        <rect x="0" y={currentY + memberHeight - 1} width="100%" height="1" fill="black" />

        {this.renderMode.showMethods && 
          this.methods.map((method: EntityMember) => {
            currentY += memberHeight;
            return (
              <Member
                y={currentY}
                key={method.id}
                entity={this}
                member={method}
                editorMode={editorMode}
                interactiveElementsMode={interactiveElementsMode}
                canBeMadeInteractive={
                  !interactiveElementIds.has(this.id)
                }
                isInteractiveElement={interactiveElementIds.has(method.id)}
                onToggleInteractiveElements={() => {
                  toggleInteractiveElements(method.id);
                }}
              />
            );
          })
        }
      </svg>
    );
  }
}

export default AbstractClass;
