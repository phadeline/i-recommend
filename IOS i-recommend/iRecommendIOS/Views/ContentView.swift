import SwiftUI

struct ContentView: View {
    @StateObject private var viewModel = RecommendationViewModel()

    var body: some View {
        NavigationView {
            VStack(spacing: 16) {
                header

                Button(action: {
                    Task {
                        await viewModel.connectAndLoad()
                    }
                }) {
                    Text("Connect Apple Music")
                        .fontWeight(.semibold)
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color.red)
                        .foregroundColor(.white)
                        .cornerRadius(12)
                }
                .disabled(viewModel.isLoading)

                if viewModel.isLoading {
                    ProgressView("Loading playlists and recommendations...")
                }

                if let errorMessage = viewModel.errorMessage {
                    Text(errorMessage)
                        .foregroundColor(.red)
                        .multilineTextAlignment(.center)
                }

                List {
                    if !viewModel.playlists.isEmpty {
                        Section("Your Playlists") {
                            ForEach(viewModel.playlists) { playlist in
                                Text(playlist.name)
                            }
                        }
                    }

                    if !viewModel.tracks.isEmpty {
                        Section("Recommended Tracks") {
                            ForEach(viewModel.tracks) { track in
                                HStack {
                                    VStack(alignment: .leading, spacing: 4) {
                                        Text(track.title)
                                            .font(.headline)
                                        Text(track.artistName)
                                            .font(.subheadline)
                                            .foregroundColor(.secondary)
                                    }
                                    Spacer()
                                    Button("Preview") {
                                        viewModel.playPreview(for: track)
                                    }
                                    .buttonStyle(.bordered)
                                }
                            }
                        }
                    }
                }
                .listStyle(.insetGrouped)

                Button("Stop Preview") {
                    viewModel.stopPreview()
                }
                .buttonStyle(.bordered)
            }
            .padding()
            .navigationTitle("i-recommend iOS")
        }
    }

    private var header: some View {
        VStack(spacing: 8) {
            Text("Welcome to i-recommend")
                .font(.title2)
                .fontWeight(.bold)
            Text("Native iOS app version for Apple Music")
                .font(.subheadline)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
        }
    }
}

#Preview {
    ContentView()
}
