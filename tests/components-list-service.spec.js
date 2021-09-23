const axios = require('axios').default;
const service = require('../src/components-list-service.js');

jest.mock('axios');

describe('components list service', () => {
  it('shoud be created', () => {
    expect(service).toBeTruthy();
  });

  describe('fetch', () => {
    it('returns list of tags', async () => {
      // Given
      const response = {
        data: [
          {
            Title: 'wiz-alert',
          },
          {
            Title: 'wiz-tabs',
          },
        ],
      };

      axios.post.mockImplementationOnce(() => Promise.resolve(response));

      // When
      const list = await service.fetch('app-id');

      // Then
      expect(list).toStrictEqual(['wiz-alert', 'wiz-tabs']);
    });

    it('trims white space from tags', async () => {
      // Given
      const response = {
        data: [
          {
            Title: 'wiz-alert       ',
          },
          {
            Title: '        wiz-tabs',
          },
        ],
      };

      axios.post.mockImplementationOnce(() => Promise.resolve(response));

      // When
      const list = await service.fetch('app-id');

      // Then
      expect(list).toStrictEqual(['wiz-alert', 'wiz-tabs']);
    });

    it('filters out tags with out titles', async () => {
      // Given
      const response = {
        data: [
          {
            Title: 'wiz-alert',
          },
          {
            Title: 'wiz-tabs',
          },
          {
            OtherProp: 'foo',
          },
        ],
      };

      axios.post.mockImplementationOnce(() => Promise.resolve(response));

      // When
      const list = await service.fetch('app-id');

      // Then
      expect(list).toStrictEqual(['wiz-alert', 'wiz-tabs']);
    });
  });
});
