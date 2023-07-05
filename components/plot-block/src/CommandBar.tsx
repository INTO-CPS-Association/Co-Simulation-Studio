import * as React from 'react';
import { CommandBar, ICommandBarItemProps } from '@fluentui/react/lib/CommandBar';
import { DirectionalHint } from '@fluentui/react/lib/Callout';
import { Coachmark } from '@fluentui/react/lib/Coachmark';
import { IComponentAsProps, IComponentAs } from '@fluentui/react/lib/Utilities';
import { TeachingBubbleContent } from '@fluentui/react/lib/TeachingBubble';
import { CommandBarButton, IButtonProps } from '@fluentui/react/lib/Button';
import { OPENPANEL } from './PlotPanel';

interface IIndividualCommandBarButtonProps {
  onDismissCoachmark: () => void;
  isCoachmarkVisible: boolean;
}

interface ICoachmarkCommandBarButtonProps extends IComponentAsProps<ICommandBarItemProps> {
  onDismiss: () => void;
  isCoachmarkVisible?: boolean;
}

/** Command bar button with a coachmark and teaching bubble */
const CoachmarkCommandBarButton: React.FunctionComponent<ICoachmarkCommandBarButtonProps> = props => {
  const targetButton = React.useRef<HTMLDivElement | null>(null);
  const { defaultRender, isCoachmarkVisible, onDismiss, ...buttonProps } = props;
  const ButtonComponent = defaultRender || CommandBarButton;

  return (
    <>
      <div ref={targetButton}>
        <ButtonComponent {...(buttonProps as any)} />
      </div>
      {isCoachmarkVisible && (
        <Coachmark
          target={targetButton.current}
          positioningContainerProps={{
            directionalHint: DirectionalHint.bottomCenter,
          }}
          ariaAlertText="A Coachmark has appeared"
          ariaDescribedBy="coachmark-desc1"
          ariaLabelledBy="coachmark-label1"
          ariaLabelledByText="Coachmark notification"
        >
          <TeachingBubbleContent
            headline="Example Title"
            hasCloseButton={true}
            closeButtonAriaLabel="Close"
            onDismiss={onDismiss}
            ariaDescribedBy="example-description1"
            ariaLabelledBy="example-label1"
          >
            Welcome to the land of Coachmarks!
          </TeachingBubbleContent>
        </Coachmark>
      )}
    </>
  );
};

const overflowButtonProps: IButtonProps = {
  ariaLabel: 'More commands',
};

/** Command bar which renders the Share button with a coachmark */
const IndividualCommandBarButton: React.FunctionComponent<
  IIndividualCommandBarButtonProps
> = props => {
  const { onDismissCoachmark, isCoachmarkVisible } = props;
  const items: ICommandBarItemProps[] = React.useMemo(() => {
    const CoachmarkButtonWrapper: IComponentAs<ICommandBarItemProps> = (p: IComponentAsProps<ICommandBarItemProps>) => {
      return (
        <CoachmarkCommandBarButton {...p} isCoachmarkVisible={isCoachmarkVisible} onDismiss={onDismissCoachmark} />
      );
    };

    return [
      {
        key: 'Settings',
        text: 'Settings',
        iconProps: { iconName: 'SettingsIcon' },
        // The Settings button will have a coachmark
        commandBarButtonAs: CoachmarkButtonWrapper,
        onClick: () => OPENPANEL() /*console.log('Settings')*/,
      },
    ];
  }, [onDismissCoachmark, isCoachmarkVisible]);

  return <CommandBar overflowButtonProps={overflowButtonProps} items={items} />;
};

export const IndividualCommandBarButtonWrapper: React.FunctionComponent = () => {
  const [isCoachmarkVisible, setIsCoachmarkVisible] = React.useState(true);

  const onDismissCoachmark = React.useCallback(() => setIsCoachmarkVisible(false), []);

  return (
    <IndividualCommandBarButton
      onDismissCoachmark={onDismissCoachmark}
      isCoachmarkVisible={isCoachmarkVisible}
    />
  );
};

