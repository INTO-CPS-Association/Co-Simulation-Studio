import * as React from 'react';
import { useId, useBoolean } from '@fluentui/react-hooks';
import { TextField } from '@fluentui/react/lib/TextField';
import {
  getTheme,
  mergeStyleSets,
  FontWeights,
  ContextualMenu,
  Toggle,
  Modal,
  IDragOptions,
  IIconProps,
  Stack,
  IStackProps,
} from '@fluentui/react';
import { DefaultButton, IconButton, IButtonStyles } from '@fluentui/react/lib/Button';
import { initializeIcons } from "@fluentui/react/lib/Icons";

initializeIcons();


export const JsonModal: React.FunctionComponent = () => {
  const [isModalOpen, { setTrue: showModal, setFalse: hideModal }] = useBoolean(false);
  const [isDraggable] = useBoolean(false);
  const [keepInBounds] = useBoolean(true);
  // Normally the drag options would be in a constant, but here the toggle can modify keepInBounds
  const dragOptions = React.useMemo(
    (): IDragOptions => ({
      moveMenuItemText: 'Move',
      closeMenuItemText: 'Close',
      menu: ContextualMenu,
      keepInBounds,
      dragHandleSelector: '.ms-Modal-scrollableContent > div:first-child',
    }),
    [keepInBounds],
  );

  // Use useId() to ensure that the IDs are unique on the page.
  // (It's also okay to use plain strings and manually ensure uniqueness.)
  const titleId = useId('title');

  return (
    <div>
      <DefaultButton onClick={showModal} text="View" />
      <Modal
        titleAriaId={titleId}
        isOpen={isModalOpen}
        onDismiss={hideModal}
        isBlocking={false}
        containerClassName={contentStyles.container}
        dragOptions={isDraggable ? dragOptions : undefined}
      >
        <div className={contentStyles.header}>
          <h2 className={contentStyles.heading} id={titleId}>
            Current chart specification
          </h2>
          <IconButton
            styles={iconButtonStyles}
            iconProps={cancelIcon}
            ariaLabel="Close popup modal"
            onClick={hideModal}
          />
        </div>
        <div className={contentStyles.body}>
            <p>
                <TextField  label="Json specification"
                            multiline
                            autoAdjustHeight
                            styles={{
                                fieldGroup: {
                                  borderRadius: 0,
                                  border: "0px solid transparent",
                                  background: "#252526"
                                },
                                field: {
                                  color: "#FFFFFF"
                                }
                            
                            }}
                            />
            </p>
        </div>
      </Modal>
    </div>
  );
};

const cancelIcon: IIconProps = { iconName: 'Cancel' };

const theme = getTheme();
const contentStyles = mergeStyleSets({
  container: {
    display: 'flex',
    flexFlow: 'column nowrap',
    alignItems: 'stretch',
  },
  header: [
    theme.fonts.xLargePlus,
    {
      flex: '1 1 auto',
      borderTop: `4px solid ${theme.palette.themePrimary}`,
      color: theme.palette.neutralPrimary,
      display: 'flex',
      alignItems: 'center',
      fontWeight: FontWeights.semibold,
      padding: '12px 12px 14px 24px',
    },
  ],
  heading: {
    color: theme.palette.neutralPrimary,
    fontWeight: FontWeights.semibold,
    fontSize: 'inherit',
    margin: '0',
  },
  body: {
    flex: '4 4 auto',
    padding: '0 24px 24px 24px',
    overflowY: 'hidden',
    selectors: {
      p: { margin: '14px 0' },
      'p:first-child': { marginTop: 0 },
      'p:last-child': { marginBottom: 0 },
    },
  },
});
const iconButtonStyles: Partial<IButtonStyles> = {
  root: {
    color: theme.palette.neutralPrimary,
    marginLeft: 'auto',
    marginTop: '4px',
    marginRight: '2px',
  },
  rootHovered: {
    color: theme.palette.neutralDark,
  },
};
