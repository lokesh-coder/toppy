import { TemplateRef } from '@angular/core';
import { ComponentType, HostArgs } from './models';

export function getContentMeta(
  content: string | TemplateRef<any> | ComponentType<any>,
  props: { [x: string]: any } = {},
  overlayID = ''
) {
  let data: HostArgs;

  if (typeof content === 'string' && props['hasHTML']) {
    data = { content, contentType: 'STRING', props };
  } else if (typeof content === 'string') {
    data = { content, props };
  } else if (content instanceof TemplateRef) {
    data = { content, contentType: 'TEMPLATEREF', props: { id: overlayID } };
  } else {
    data = {
      content,
      props: { ...props, id: overlayID },
      contentType: 'COMPONENT'
    };
  }
  return data;
}
