import {describe, it, expect} from 'vitest';
import {mount} from '@vue/test-utils';
import IconComponent, {type IconString} from '@/components/IconComponent.vue';

const icons: IconString[] = [
  'arrowLeft',
  'bluesky',
  'calendarWeek',
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
  'databaseExport',
  'databaseImport',
  'earth',
  'formatListChecks',
  'googlePlay',
  'history',
  'minus',
  'plus',
  'radioboxBlank',
  'radioboxMarked',
  'shareVariant',
  'trashCan',
  'trophy',
];

describe('IconComponent', () => {
  it.each(icons)('renders %s', (icon) => {
    const wrapper = mount(IconComponent, {
      props: {
        icon,
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
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
