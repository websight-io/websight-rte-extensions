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

import {
    combineTransactionSteps,
    findChildrenInRange,
    getChangedRanges,
    getMarksBetween,
    NodeWithPos,
  } from '@tiptap/core';
  import { MarkType } from 'prosemirror-model';
  import { Plugin, PluginKey } from 'prosemirror-state';
  import { find, test } from 'linkifyjs';
import { splitEmail } from './splitEmail.js';
  
  type AutolinkOptions = {
    type: MarkType
    validate?: (url: string) => boolean
  }
  
  export function autolink(options: AutolinkOptions): Plugin {
    return new Plugin({
      key: new PluginKey('autolinkEmail'),
      appendTransaction: (transactions, oldState, newState) => {
        const docChanges = transactions.some(transaction => transaction.docChanged) && !oldState.doc.eq(newState.doc);
        const preventAutolink = transactions.some(transaction => transaction.getMeta('preventAutolink'));
  
        if (!docChanges || preventAutolink) {
          return;
        }
  
        const { tr } = newState;
        const transform = combineTransactionSteps(oldState.doc, [...transactions]);
        const { mapping } = transform;
        const changes = getChangedRanges(transform);
  
        changes.forEach(({ oldRange, newRange }) => {
          // at first we check if we have to remove links
          getMarksBetween(oldRange.from, oldRange.to, oldState.doc)
            .filter(item => item.mark.type === options.type)
            .forEach(oldMark => {
              const newFrom = mapping.map(oldMark.from);
              const newTo = mapping.map(oldMark.to);
              const newMarks = getMarksBetween(newFrom, newTo, newState.doc).filter(
                item => item.mark.type === options.type,
              );
  
              if (!newMarks.length) {
                return;
              }
  
              const newMark = newMarks[0];
              const oldLinkText = oldState.doc.textBetween(oldMark.from, oldMark.to, undefined, ' ');
              const newLinkText = newState.doc.textBetween(newMark.from, newMark.to, undefined, ' ');
              const wasLink = test(oldLinkText, 'email');
              const isLink = test(newLinkText, 'email');
  
              // remove only the link, if it was a link before too
              // because we don’t want to remove links that were set manually
              if (wasLink && !isLink) {
                tr.removeMark(newMark.from, newMark.to, options.type);
              }
            });
  
          // now let’s see if we can add new links
          const nodesInChangedRanges = findChildrenInRange(
            newState.doc,
            newRange,
            node => node.isTextblock,
          );
  
          let textBlock: NodeWithPos | undefined;
          let textBeforeWhitespace: string | undefined;
  
          if (nodesInChangedRanges.length > 1) {
            // Grab the first node within the changed ranges (ex. the first of two paragraphs when hitting enter)
            textBlock = nodesInChangedRanges[0];
            textBeforeWhitespace = newState.doc.textBetween(
              textBlock.pos,
              textBlock.pos + textBlock.node.nodeSize,
              undefined,
              ' ',
            );
          } else if (
            nodesInChangedRanges.length
            // We want to make sure to include the block seperator argument to treat hard breaks like spaces
            && newState.doc.textBetween(newRange.from, newRange.to, ' ', ' ').endsWith(' ')
          ) {
            textBlock = nodesInChangedRanges[0];
            textBeforeWhitespace = newState.doc.textBetween(
              textBlock.pos,
              newRange.to,
              undefined,
              ' ',
            );
          }
  
          if (textBlock && textBeforeWhitespace) {
            const wordsBeforeWhitespace = textBeforeWhitespace.split(' ').filter(s => s !== '');
  
            if (wordsBeforeWhitespace.length <= 0) {
              return false;
            }
  
            const lastWordBeforeSpace = wordsBeforeWhitespace[wordsBeforeWhitespace.length - 1];
            const lastWordAndBlockOffset = textBlock.pos + textBeforeWhitespace.lastIndexOf(lastWordBeforeSpace);
  
            if (!lastWordBeforeSpace) {
              return false;
            }
  
            find(lastWordBeforeSpace, 'email')
              .filter(link => link.isLink)
              .filter(link => {
                if (options.validate) {
                  return options.validate(link.value);
                }
                return true;
              })
              // calculate link position
              .map(link => ({
                ...link,
                from: lastWordAndBlockOffset + link.start + 1,
                to: lastWordAndBlockOffset + link.end + 1,
              }))
              // add link mark
              .forEach(link => {
                tr.addMark(
                  link.from,
                  link.to,
                  options.type.create(splitEmail(link.href)),
                );
              });
          }
        });
  
        if (!tr.steps.length) {
          return;
        }
  
        return tr;
      },
    });
  }
