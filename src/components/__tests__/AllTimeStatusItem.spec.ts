import {describe, it, expect, vi} from 'vitest';
import {mount} from '@vue/test-utils';
import AllTimeStatusItem from '@/components/AllTimeStatusItem.vue';

describe('AllTimeStatusItem', () => {
  it.each([
    [
      0,
      {
        totalWeeks: 'In Total 0 Weeks',
        over30Veggies: 'Over 30 Veggies in 0 Weeks',
        uniqueVeggies: 'In Total 0 Unique Veggies',
        atMostVeggies: 'At Most 0 Weekly Veggies',
        completedChallenges: 'Completed 0 Weekly Challenges',
      },
    ],
    [
      1,
      {
        totalWeeks: 'In Total 1 Week',
        over30Veggies: 'Over 30 Veggies in 1 Week',
        uniqueVeggies: 'In Total 1 Unique Veggie',
        atMostVeggies: 'At Most 1 Weekly Veggie',
        completedChallenges: 'Completed 1 Weekly Challenge',
      },
    ],
    [
      2,
      {
        totalWeeks: 'In Total 2 Weeks',
        over30Veggies: 'Over 30 Veggies in 2 Weeks',
        uniqueVeggies: 'In Total 2 Unique Veggies',
        atMostVeggies: 'At Most 2 Weekly Veggies',
        completedChallenges: 'Completed 2 Weekly Challenges',
      },
    ],
  ])('renders pluralized keys for amount %i', (statAmount, keys) => {
    Object.entries(keys).forEach(([statKey, value]) => {
      const wrapper = mount(AllTimeStatusItem, {
        props: {statAmount, statKey},
      });
      expect(wrapper.text()).toBe(value);
    });
  });

  it('copies to clipboard', async () => {
    const clipboard = navigator.clipboard;
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn(),
      },
    });

    try {
      const wrapper = mount(AllTimeStatusItem, {
        props: {
          statAmount: 0,
          statKey: 'totalWeeks',
        },
      });

      await wrapper.findByTestId('all-time-status-item-copy-button-totalWeeks').trigger('click');
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        "I've used Eat Your Veggies for 0 weeks! Try it out:\nhttps://eatyourveggies.app",
      );
    } finally {
      Object.assign(navigator, {clipboard});
    }
  });

  it('shares', async () => {
    const share = navigator.share;
    Object.assign(navigator, {
      share: vi.fn(),
    });

    try {
      const wrapper = mount(AllTimeStatusItem, {
        props: {
          statAmount: 0,
          statKey: 'totalWeeks',
        },
      });

      await wrapper.findByTestId('all-time-status-item-share-button-totalWeeks').trigger('click');
      expect(navigator.share).toHaveBeenCalledWith({
        url: 'https://eatyourveggies.app',
        text: "I've used Eat Your Veggies for 0 weeks! Try it out:",
      });
    } finally {
      Object.assign(navigator, {share});
    }
  });
});
