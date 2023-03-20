/*
 * Copyright (C) 2022 Dynamic Solutions
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import PropTypes from 'prop-types';
import React, { useState } from 'react';
import styled from 'styled-components';
import AtlaskitButton, { ButtonGroup } from '@atlaskit/button';
import TextField from '@atlaskit/textfield';

import Popup from 'components/richtext/ui/Popup';
import Button from 'components/richtext/ui/Button';

const DialogContainer = styled.div`
    padding: 16px;
    & > div {
        margin-top: 8px;
    }
`;

const DialogFooter = styled.div`
    padding-top: 8px;
    float: right;
`;

const componentName = 'RichText_Email';

const EmailDialogContent = ({
    submit,
    hrefDecoded: initialHref
}) => {
    const [hrefDecoded, setHrefDecoded] = useState(initialHref);

    const onLinkChange = (event) => {
        setHrefDecoded(event.target.value);
    };

    const onApply = () => {
        submit({ hrefDecoded });
    };

    const onRemove = () => {
        submit({});
    };

    return (
        <DialogContainer>
            <TextField
                autoComplete="off"
                value={hrefDecoded}
                placeholder="Enter Email"
                onChange={onLinkChange}
                testId={`${componentName}_Path`}
            />
            <DialogFooter>
                <ButtonGroup>
                    <AtlaskitButton
                        appearance="primary"
                        onClick={onApply}
                        testId={`${componentName}_ApplyButton`}
                    >
                        Apply
                    </AtlaskitButton>
                    <AtlaskitButton
                        appearance="subtle"
                        onClick={onRemove}
                        testId={`${componentName}_RemoveButton`}
                    >
                        Remove
                    </AtlaskitButton>
                </ButtonGroup>
            </DialogFooter>
        </DialogContainer>
    );
};

EmailDialogContent.propTypes = {
    submit: PropTypes.func.isRequired,
    hrefDecoded: PropTypes.string
};

const EmailDialog = ({ configuration, state, action }) => {
    const { title, icon } = configuration;
    const { isActive, 'data-part1': part1, 'data-part2': part2, 'data-part3': part3 } = state;
    const { execute } = action;

    const dialogRef = React.createRef();

    const setValue = () => {
        if (part1 !== undefined && part2 !== undefined && part3 !== undefined) {
            return `${part1}@${part2}.${part3}`;
        } else {
            return null;
        }
    };

    const open = () => {
        dialogRef.current.toggle();
    };

    const onSubmit = (params) => {
        execute(params);
        dialogRef.current.close();
    };

     return (
        <Popup
            ref={dialogRef}
            content={
                <EmailDialogContent
                    submit={onSubmit}
                    hrefDecoded={setValue()}
                />
            }
        >
            <Button
                configuration={{ title, icon }}
                state={{ isActive }}
                action={{ execute: open }}
            />
        </Popup>
     );
};

EmailDialog.propTypes = {
    configuration: PropTypes.shape({
        title: PropTypes.string.isRequired,
        icon: PropTypes.string,
    }).isRequired,
    state: PropTypes.shape({
        isActive: PropTypes.bool.isRequired,
        'data-part1': PropTypes.string.isRequired,
        'data-part2': PropTypes.string.isRequired,
        'data-part3': PropTypes.string.isRequired
    }).isRequired,
    action: PropTypes.shape({
        execute: PropTypes.func.isRequired,
    }).isRequired,
};

export default EmailDialog;
