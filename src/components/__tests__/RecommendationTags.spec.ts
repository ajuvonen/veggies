import {describe, it, expect} from 'vitest';
import {mount} from '@vue/test-utils';
import RecommendationTags from '@/components/RecommendationTags.vue';

describe('RecommendationTags', () => {
  it('renders empty', () => {
    const wrapper = mount(RecommendationTags, {
      props: {
        favorites: [],
      },
    });
    expect(wrapper).toBeTruthy();
    expect(wrapper.find('button').exists()).toBe(false);
  });

  it('renders tags', () => {
    const wrapper = mount(RecommendationTags, {
      props: {
        favorites: ['tomato', 'wheat', 'black-eyed pea'],
      },
    });

    const buttons = wrapper.findAll('button');
    expect(buttons).toHaveLength(3);
    expect(buttons.some((button) => button.text() === 'tomato')).toBe(true);
    expect(buttons.some((button) => button.text() === 'wheat')).toBe(true);
    expect(buttons.some((button) => button.text() === 'black-eyed pea')).toBe(true);
  });

  it('emits event', async () => {
    const wrapper = mount(RecommendationTags, {
      props: {
        favorites: ['strawberry'],
      },
    });

    await wrapper.find('button').trigger('click');
    const events = wrapper.emitted('toggle');
    expect(events).toHaveLength(1);
    expect(events![0]).toEqual(['strawberry']);
  });
});
