import * as React from 'react';
import { render } from '@testing-library/react';
import { Point } from '../../../../main/utils/geometry/point';
import { UMLInterfaceProvidedComponent } from '../../../../main/packages/common/uml-interface-provided/uml-interface-provided-component';
import { UMLComponentInterfaceProvided } from '../../../../main/packages/uml-component-diagram/uml-component-interface-provided/uml-component-interface-provided';

it('render the uml-component-interface-provided-component', () => {
  const umlComponentInterfaceProvided: UMLComponentInterfaceProvided = new UMLComponentInterfaceProvided({
    id: "d37b8ce3-17d2-4432-8fff-6c38ff2a1334",
    path: [new Point(0, 0), new Point(100, 100)],
  });
  const { getByText, baseElement } = render(
    <svg>
      <UMLInterfaceProvidedComponent element={umlComponentInterfaceProvided} />
    </svg>,
  );
  // TODO: expect
  // expect(getByText(artifact.name)).toBeInTheDocument();
  expect(baseElement).toMatchSnapshot();
});
