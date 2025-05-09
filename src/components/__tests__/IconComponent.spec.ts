import {describe, it, expect} from 'vitest';
import {mount} from '@vue/test-utils';
import IconComponent, {type IconString} from '@/components/IconComponent.vue';

describe('IconComponent', () => {
  it('renders icons', () => {
    const icons: IconString[] = [
      'bluesky',
      'calendarWeekOutline',
      'chart',
      'chartLine',
      'check',
      'checkboxBlank',
      'checkboxMarked',
      'chevronDoubleDown',
      'chevronDoubleUp',
      'chevronDown',
      'close',
      'cog',
      'contentCopy',
      'earth',
      'formatListChecks',
      'history',
      'minus',
      'plus',
      'radioboxBlank',
      'radioboxMarked',
      'shareVariant',
      'trashCan',
      'trophyOutline',
    ];

    icons.forEach((icon) => {
      const wrapper = mount(IconComponent, {
        props: {
          icon,
        },
      });
      expect(wrapper.html()).toMatchSnapshot(`renders ${icon}`);
    });
  });

  it('uses size property', async () => {
    const wrapper = mount(IconComponent, {
      props: {
        icon: 'bluesky',
      },
    });

    expect(wrapper.find('svg').attributes('style')).toBe('width: 1.25rem; height: 1.25rem;');
    await wrapper.setProps({size: '2rem'});
    expect(wrapper.find('svg').attributes('style')).toBe('width: 2rem; height: 2rem;');
  });
});
