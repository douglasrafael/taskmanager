import { SearchFilterPipe } from 'app/shared/pipes/searchfilter.pipe';

describe('SearchfilterPipe', () => {
  it('create an instance', () => {
    const pipe = new SearchFilterPipe();
    expect(pipe).toBeTruthy();
  });
});
