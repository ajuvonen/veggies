import {describe, it, expect, vi} from 'vitest';
import {mount} from '@vue/test-utils';
import StatContainer from '@/components/StatContainer.vue';

describe('StatContainer', () => {
  it('renders different keys', () => {
    const keys = {
      totalWeeks: 'In Total 0 Weeks',
      over30Veggies: 'Over 30 Veggies in 0 Weeks',
      uniqueVeggies: 'In Total 0 Unique Veggies',
      atMostVeggies: 'At Most 0 Veggies in a Week',
      completedChallenges: 'Completed 0 Weekly Challenges',
    };
    Object.entries(keys).forEach(([key, value]) => {
      const wrapper = mount({
        template: '<div><StatContainer :statAmount="statAmount" :statKey="statKey" /></div>',
        components: {
          StatContainer,
        },
        data: () => ({
          statAmount: 0,
          statKey: key,
        }),
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

    const wrapper = mount(StatContainer, {
      props: {
        statAmount: 0,
        statKey: 'totalWeeks',
      },
    });

    await wrapper.findByTestId('stat-container-copy-button-totalWeeks').trigger('click');
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      "I've used Eat Your Veggies now for 0 weeks! Try for free: https://eatyourveggies.app",
    );
    Object.assign(navigator, {clipboard});
  });

  it('shares', async () => {
    const share = navigator.share;
    Object.assign(navigator, {
      share: vi.fn(),
    });

    const wrapper = mount(StatContainer, {
      props: {
        statAmount: 0,
        statKey: 'totalWeeks',
      },
    });

    await wrapper.findByTestId('stat-container-share-button-totalWeeks').trigger('click');
    expect(navigator.share).toHaveBeenCalledWith({
      url: 'https://eatyourveggies.app',
      text: "I've used Eat Your Veggies now for 0 weeks! Try for free:",
    });
    Object.assign(navigator, {share});
  });
});
