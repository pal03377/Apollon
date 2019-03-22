import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { State as ReduxState } from './../Store';
import Element, { ElementRepository } from './../../domain/Element';
import ElementComponent, {
  OwnProps as ComponentProps,
} from './ElementComponent';
import hoverable from './Hoverable';
import selectable from './Selectable';
import movable from './Movable';
import resizable from './Resizable';
import connectable from './Connectable';
import droppable from './Droppable';
import editable from './Editable';
import interactable from './Interactable';
import Container from '../../domain/Container';
import { ApollonView } from '../../services/editor';
import { ApollonMode } from '../../ApollonEditor';

class LayoutedElement extends Component<Props, State> {
  state: State = {
    element: this.props.getById(this.props.element),
  };

  component: typeof ElementComponent = this.composeComponent();

  private composeComponent(): typeof ElementComponent {
    const { readonly, view, mode } = this.props;
    type DecoratorType = (
      Component: typeof ElementComponent
    ) => React.ComponentClass<ComponentProps>;
    let decorators: DecoratorType[] = [];

    if (mode === ApollonMode.Assessment) {
      decorators = [editable, selectable, hoverable];
    } else if (readonly) {
      decorators = [selectable, hoverable];
    } else if (
      view === ApollonView.Exporting ||
      view == ApollonView.Highlight
    ) {
      decorators = [interactable, hoverable];
    } else {
      const element = this.props.getById(this.props.element);
      const { features } = element.constructor as typeof Element;
      if (features.editable) decorators.push(editable);
      if (
        element instanceof Container &&
        (element.constructor as typeof Container).features.droppable
      )
        decorators.push(droppable);
      if (features.connectable) decorators.push(connectable);
      if (features.resizable !== 'NONE') decorators.push(resizable);
      if (features.movable) decorators.push(movable);
      if (features.selectable) decorators.push(selectable);
      if (features.hoverable) decorators.push(hoverable);
    }

    return compose<typeof ElementComponent>(...decorators)(ElementComponent);
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.view !== this.props.view) {
      this.component = this.composeComponent();
      this.forceUpdate();
    }
  }

  render() {
    const Component = this.component;
    const element = this.props.getById(this.props.element);
    if (!Object.keys(element).length) return null;
    return (
      <Component
        element={element}
        interactable={
          this.props.view === ApollonView.Exporting ||
          this.props.view === ApollonView.Highlight
        }
        hidden={
          this.props.view === ApollonView.Highlight && element.interactive
        }
      />
    );
  }
}

interface OwnProps {
  element: string;
}

interface StateProps {
  getById: (id: string) => Element;
  readonly: boolean;
  view: ApollonView;
  mode: ApollonMode;
}

type Props = OwnProps & StateProps;

interface State {
  element: Element;
}

const mapStateToProps = (state: ReduxState): StateProps => ({
  getById: ElementRepository.getById(state.elements),
  readonly: state.editor.readonly,
  view: state.editor.view,
  mode: state.editor.mode,
});

export default connect(mapStateToProps)(LayoutedElement);
