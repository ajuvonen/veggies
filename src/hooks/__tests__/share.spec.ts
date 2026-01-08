import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import {useShare} from '@/hooks/share';
import {APP_URL} from '@/utils/constants';
import {withSetup} from './testHelpers';

describe('share', () => {
  let originalShare: typeof navigator.share | undefined;
  let originalClipboard: typeof navigator.clipboard;

  beforeEach(() => {
    originalShare = navigator.share;
    originalClipboard = navigator.clipboard;
  });

  afterEach(() => {
    // Restore original navigator properties
    if (originalShare === undefined) {
      // @ts-expect-error - deleting navigator.share
      delete navigator.share;
    } else {
      Object.assign(navigator, {share: originalShare});
    }
    Object.assign(navigator, {clipboard: originalClipboard});
    vi.restoreAllMocks();
  });

  describe('share', () => {
    it('supports share when navigator.share is available', () => {
      Object.assign(navigator, {
        share: vi.fn(),
      });

      const {shareSupported} = withSetup(useShare);
      expect(shareSupported).toBe(true);
    });

    it('does not support share when navigator.share is unavailable', () => {
      // @ts-expect-error - deleting navigator.share
      delete navigator.share;

      const {shareSupported} = withSetup(useShare);
      expect(shareSupported).toBe(false);
    });

    it('calls navigator.share when share is supported', async () => {
      const mockShare = vi.fn();
      Object.assign(navigator, {
        share: mockShare,
      });

      const {shareOrCopy} = withSetup(useShare);
      await shareOrCopy('allTimeStatus.totalWeeks.shareText', [5]);

      // Verify navigator.share was called with the correct structure
      expect(mockShare).toHaveBeenCalledTimes(1);
      const callArgs = mockShare.mock.calls[0][0];
      expect(callArgs).toHaveProperty('text');
      expect(callArgs).toHaveProperty('url', APP_URL);
      expect(callArgs.text).toContain("I've used Eat Your Veggies for 5 weeks! Try it out:");
      expect(callArgs.text).not.toContain(APP_URL);
    });

    it('uses clipboard when share is not supported', async () => {
      // @ts-expect-error - deleting navigator.share
      delete navigator.share;

      const mockWriteText = vi.fn();
      Object.assign(navigator, {
        clipboard: {
          writeText: mockWriteText,
        },
      });

      const {shareOrCopy} = withSetup(useShare);
      await shareOrCopy('allTimeStatus.totalWeeks.shareText', [5]);

      // Verify clipboard.writeText was called
      expect(mockWriteText).toHaveBeenCalledTimes(1);
      const text = mockWriteText.mock.calls[0][0];
      expect(text).toBe(`I've used Eat Your Veggies for 5 weeks! Try it out:\n${APP_URL}`);
    });
  });
});
